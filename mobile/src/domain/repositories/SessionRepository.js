export class SessionRepository {
  async getSession() {
    throw new Error("SessionRepository.getSession not implemented");
  }

  async saveSession(_session) {
    throw new Error("SessionRepository.saveSession not implemented");
  }

  async clearSession() {
    throw new Error("SessionRepository.clearSession not implemented");
  }

  async saveUser(_user) {
    throw new Error("SessionRepository.saveUser not implemented");
  }
}