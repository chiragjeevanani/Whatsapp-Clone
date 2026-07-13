// Configuration constants for API and Socket.io hosts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4003";
export const UPLOAD_LIMIT_MB = 16;
export const VERSION = "1.0.0-enterprise";
