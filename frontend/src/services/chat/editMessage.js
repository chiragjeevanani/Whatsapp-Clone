import { apiClient } from "../common/apiClient";

export async function editMessage(conversationId, messageId, text) {
  return apiClient.patch(`/chats/${conversationId}/messages/${messageId}`, { text });
}
