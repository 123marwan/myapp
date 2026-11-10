import { SessionRepository } from "../../domain/repositories/SessionRepository";
import {
  clearStoredSession,
  getStoredSession,
  persistSession,
  persistStoredUser,
} from "../storage/sessionStorage";

export class SessionRepositoryImpl extends SessionRepository {
  async getSession() {
    return getStoredSession();
  }

  async saveSession(session) {
    await persistSession(session);
  }

  async clearSession() {
    await clearStoredSession();
  }

  async saveUser(user) {
    await persistStoredUser(user);
  }
}