import { apiClient } from "../common/apiClient";

export async function logout() {
  return apiClient.post("/auth/logout", {});
}
