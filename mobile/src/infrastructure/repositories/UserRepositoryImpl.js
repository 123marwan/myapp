import { UserRepository } from "../../domain/repositories/UserRepository";
import { authHeaders, httpClient } from "../http/httpClient";

export class UserRepositoryImpl extends UserRepository {
  async listUsers(token) {
    const { data } = await httpClient.get("/users", { headers: authHeaders(token) });
    return Array.isArray(data) ? data : [];
  }
}