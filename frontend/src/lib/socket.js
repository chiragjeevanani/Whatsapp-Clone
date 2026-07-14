import { io } from "socket.io-client";

class SocketHelper {
  constructor() {
    this.socket = null;
  }

  connect(url, token) {
    if (this.socket) {
      return this.socket;
    }
    console.log("Connecting to WebSocket gateway at:", url);
    this.socket = io(url, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket gateway successfully!");
    });

    this.socket.on("connect_error", async (error) => {
      console.error("WebSocket connection error:", error);
      
      // If token has expired or auth failed, try to refresh token and reconnect
      if (error.message && (error.message.includes("Authentication") || error.message.includes("token") || error.message.includes("expired") || error.message.includes("jwt"))) {
        console.log("WebSocket auth failed. Attempting to refresh token...");
        try {
          const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
          if (refreshToken) {
            const API_BASE_URL = "http://localhost:4000/api/v1";
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });
            
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData && refreshData.success && refreshData.data && refreshData.data.accessToken) {
                console.log("Token refreshed successfully for WebSocket retry!");
                localStorage.setItem("token", refreshData.data.accessToken);
                if (refreshData.data.refreshToken) {
                  localStorage.setItem("refreshToken", refreshData.data.refreshToken);
                }
                
                // Update socket auth configuration and reconnect
                this.socket.auth = { token: refreshData.data.accessToken };
                this.socket.connect();
                return;
              }
            }
          }
        } catch (refreshErr) {
          console.error("Failed to refresh token during WebSocket retry:", refreshErr);
        }
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  updateToken(token) {
    if (this.socket) {
      console.log("Updating WebSocket connection token...");
      this.socket.auth = { token };
      this.socket.disconnect().connect();
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketClient = new SocketHelper();
