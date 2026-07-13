import { apiClient } from "../common/apiClient";

export async function getMessages(conversationId, options = {}) {
  const query = options.limit ? `?limit=${options.limit}` : "";
  return apiClient.get(`/chats/${conversationId}/messages${query}`);
}
