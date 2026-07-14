"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { socketClient } from "@/lib/socket";
import { SOCKET_URL } from "@/config";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socketClient.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const client = socketClient.connect(SOCKET_URL, token);
    setSocket(client);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    client.on("connect", onConnect);
    client.on("disconnect", onDisconnect);

    // If already connected when effect runs
    if (client.connected) {
      setConnected(true);
    }

    return () => {
      client.off("connect", onConnect);
      client.off("disconnect", onDisconnect);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
