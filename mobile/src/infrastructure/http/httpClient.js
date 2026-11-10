import axios from "axios";
import { API_URL } from "../config/apiConfig";

export const httpClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}