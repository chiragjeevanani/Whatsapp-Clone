import { apiClient } from "../common/apiClient";

export async function refresh(refreshToken) {
  return apiClient.post("/auth/refresh", { refreshToken });
}
