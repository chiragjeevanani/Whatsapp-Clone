import { apiClient } from "../common/apiClient";

export async function deleteChat(conversationId) {
  return apiClient.delete(`/chats/${conversationId}`);
}

export async function archiveChat(conversationId, archive = true) {
  return apiClient.patch(`/chats/${conversationId}/archive`, { archive });
}

export async function muteChat(conversationId, enabled, duration = null) {
  return apiClient.patch(`/chats/${conversationId}/mute`, { enabled, duration });
}

export async function lockChat(conversationId, locked = true) {
  return apiClient.patch(`/chats/${conversationId}/lock`, { locked });
}
