import { apiClient } from "../common/apiClient";

export async function login(phoneNumber) {
  return apiClient.post("/auth/login", { phoneNumber });
}
