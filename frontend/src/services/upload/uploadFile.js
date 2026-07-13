import { apiClient } from "../common/apiClient";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  // We can pass options with custom headers or content-type
  return apiClient.request("/upload", {
    method: "POST",
    body: formData,
    headers: {
      // Fetch will automatically determine the boundary for FormData
      "Content-Type": undefined,
    },
  });
}
