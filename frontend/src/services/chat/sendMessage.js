import { apiClient } from "../common/apiClient";

export async function sendMessage(conversationId, messageData) {
  return apiClient.post(`/chats/${conversationId}/messages`, messageData);
}
