import { apiClient } from "../common/apiClient";

export async function getContacts() {
  return apiClient.get("/users/contacts");
}

export async function addContact(phone, customName = "") {
  return apiClient.post("/users/contacts", { phone, customName });
}

export async function removeContact(contactUserId) {
  return apiClient.delete(`/users/contacts/${contactUserId}`);
}

export async function syncContacts(phoneNumbers) {
  return apiClient.post("/users/contacts/sync", { phoneNumbers });
}

export async function blockUser(targetUserId) {
  return apiClient.post("/users/block", { targetUserId });
}

export async function unblockUser(targetUserId) {
  return apiClient.post("/users/unblock", { targetUserId });
}
