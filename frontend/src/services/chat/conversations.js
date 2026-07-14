import { apiClient } from "../common/apiClient";

export async function getConversations() {
  return apiClient.get("/chats");
}

export async function createConversation(targetUserId) {
  return apiClient.post("/chats", { targetUserId });
}

export async function getConversationDetails(conversationId) {
  return apiClient.get(`/chats/${conversationId}`);
}
