import { apiClient } from "../common/apiClient";

export async function getProfile() {
  return apiClient.get("/profile");
}

export async function updateProfile(data) {
  return apiClient.put("/profile", data);
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  return apiClient.post("/profile/avatar", formData);
}

export async function deleteAvatar() {
  return apiClient.delete("/profile/avatar");
}

export async function deleteAccount() {
  return apiClient.delete("/profile");
}
