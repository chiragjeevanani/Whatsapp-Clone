import { apiClient } from "../common/apiClient";

export async function createGroup(name, participants, avatarUrl = "") {
  return apiClient.post("/chats/group", { name, participants, avatarUrl });
}

export async function addGroupMembers(conversationId, memberIds) {
  return apiClient.post(`/chats/${conversationId}/members`, { memberIds });
}

export async function removeGroupMember(conversationId, userId) {
  return apiClient.delete(`/chats/${conversationId}/members/${userId}`);
}

export async function leaveGroup(conversationId) {
  return apiClient.post(`/chats/${conversationId}/leave`);
}

export async function updateGroupInfo(conversationId, updates) {
  return apiClient.patch(`/chats/${conversationId}/group-info`, updates);
}

export async function makeAdmin(conversationId, userId) {
  return apiClient.patch(`/chats/${conversationId}/admins/${userId}`);
}

export async function removeAdmin(conversationId, userId) {
  return apiClient.delete(`/chats/${conversationId}/admins/${userId}`);
}
