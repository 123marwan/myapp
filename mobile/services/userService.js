import { authHeaders, httpClient } from "./httpClient";

export async function fetchUsers(token) {
  const { data } = await httpClient.get("/users", { headers: authHeaders(token) });
  return Array.isArray(data) ? data : [];
}