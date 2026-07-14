import { apiClient } from "../common/apiClient";

export async function setupSecretCode(code) {
  return apiClient.post("/users/secret-code/setup", { code });
}

export async function verifySecretCode(code) {
  return apiClient.post("/users/secret-code/verify", { code });
}
