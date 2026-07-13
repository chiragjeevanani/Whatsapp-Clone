import { apiClient } from "../common/apiClient";

export async function getProfile(userId) {
  return apiClient.get(`/users/${userId}`);
}
