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

export async function favouriteConversation(conversationId, favourite = true) {
  return apiClient.patch(`/chats/${conversationId}/favourite`, { favourite });
}

export async function clearConversation(conversationId) {
  return apiClient.put(`/chats/${conversationId}/clear`);
}
