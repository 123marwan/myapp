export class AuthRepository {
  async login(_credentials) {
    throw new Error("AuthRepository.login not implemented");
  }

  async register(_payload) {
    throw new Error("AuthRepository.register not implemented");
  }

  async getCurrentUser(_token) {
    throw new Error("AuthRepository.getCurrentUser not implemented");
  }
}