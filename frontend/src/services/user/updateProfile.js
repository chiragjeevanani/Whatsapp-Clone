import { apiClient } from "../common/apiClient";

export async function updateProfile(userId, profileData) {
  return apiClient.put(`/users/${userId}`, profileData);
}
