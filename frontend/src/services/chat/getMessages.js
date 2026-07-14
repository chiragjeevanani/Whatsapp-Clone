import { apiClient } from "../common/apiClient";

export async function getMessages(conversationId, options = {}) {
  const params = [];
  if (options.before) params.push(`before=${options.before}`);
  if (options.limit) params.push(`limit=${options.limit}`);
  
  const query = params.length ? `?${params.join("&")}` : "";
  return apiClient.get(`/chats/${conversationId}/messages${query}`);
}
