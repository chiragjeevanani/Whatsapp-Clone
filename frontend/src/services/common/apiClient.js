import { API_URL } from "@/config";
import { socketClient } from "@/lib/socket";
const API_BASE_URL = API_URL;

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Inject headers
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    // Inject JWT Token if available
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Auto token refresh / Login Redirect (Status 401)
      if (response.status === 401 && typeof window !== "undefined") {
        if (!endpoint.includes("/auth/refresh")) {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
              });
              
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                if (refreshData && refreshData.success && refreshData.data && refreshData.data.accessToken) {
                  localStorage.setItem("token", refreshData.data.accessToken);
                  if (refreshData.data.refreshToken) {
                    localStorage.setItem("refreshToken", refreshData.data.refreshToken);
                  }
                  
                  // Notify and update WebSocket connection with the new token
                  socketClient.updateToken(refreshData.data.accessToken);
                  
                  // Retry the original request
                  const retryHeaders = {
                    ...headers,
                    "Authorization": `Bearer ${refreshData.data.accessToken}`,
                  };
                  const retryConfig = {
                    ...options,
                    headers: retryHeaders,
                  };
                  
                  const retryRes = await fetch(url, retryConfig);
                  if (retryRes.ok) {
                    return await retryRes.json();
                  }
                }
              }
            } catch (err) {
              console.error("Token refresh failed:", err);
            }
          }
        }

        // Cleanup local storage
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Redirect to login page if we are not already on login/verify screens
        if (window.location.pathname !== "/login" && window.location.pathname !== "/login/verify") {
          window.location.href = "/login";
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request(endpoint, { 
      ...options, 
      method: "POST", 
      body: isFormData ? body : JSON.stringify(body) 
    });
  }

  put(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request(endpoint, { 
      ...options, 
      method: "PUT", 
      body: isFormData ? body : JSON.stringify(body) 
    });
  }

  patch(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request(endpoint, { 
      ...options, 
      method: "PATCH", 
      body: isFormData ? body : JSON.stringify(body) 
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
