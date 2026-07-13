import { apiClient } from "../common/apiClient";

export async function verifyOtp(phoneNumber, code) {
  return apiClient.post("/auth/verify", { phoneNumber, code });
}
