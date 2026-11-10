import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { authHeaders, httpClient } from "../http/httpClient";

export class AuthRepositoryImpl extends AuthRepository {
  async login(credentials) {
    const { data } = await httpClient.post("/login", credentials);
    return data;
  }

  async register(payload) {
    const { data } = await httpClient.post("/register", payload);
    return data;
  }

  async getCurrentUser(token) {
    const { data } = await httpClient.get("/me", { headers: authHeaders(token) });
    return data;
  }
}