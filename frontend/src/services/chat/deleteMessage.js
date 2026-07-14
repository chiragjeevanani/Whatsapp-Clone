import { apiClient } from "../common/apiClient";

export async function deleteMessage(conversationId, messageId, type = "me") {
  return apiClient.delete(`/chats/${conversationId}/messages/${messageId}?type=${type}`);
}
