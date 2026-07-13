import { apiClient } from "../common/apiClient";

export async function getConversations() {
  return apiClient.get("/chats");
}
