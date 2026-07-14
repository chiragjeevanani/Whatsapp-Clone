import { apiClient } from "../common/apiClient";

export async function uploadFile(file, type = "image") {
  const formData = new FormData();
  // Field name matches backend routing (image, video, document, audio)
  formData.append(type, file);
  
  return apiClient.post(`/upload/${type}`, formData);
}
