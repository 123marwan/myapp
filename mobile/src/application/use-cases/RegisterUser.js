export class RegisterUser {
  constructor({ authRepository, sessionRepository }) {
    this.authRepository = authRepository;
    this.sessionRepository = sessionRepository;
  }

  async execute(payload) {
    const session = await this.authRepository.register(payload);
    await this.sessionRepository.saveSession(session);
    return session;
  }
}