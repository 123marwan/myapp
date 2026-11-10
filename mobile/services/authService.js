import { authHeaders, httpClient } from "./httpClient";

export async function login(credentials) {
  const { data } = await httpClient.post("/login", credentials);
  return data;
}

export async function register(payload) {
  const { data } = await httpClient.post("/register", payload);
  return data;
}

export async function fetchCurrentUser(token) {
  const { data } = await httpClient.get("/me", { headers: authHeaders(token) });
  return data;
}