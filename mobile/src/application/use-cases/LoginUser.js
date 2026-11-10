export class LoginUser {
  constructor({ authRepository, sessionRepository }) {
    this.authRepository = authRepository;
    this.sessionRepository = sessionRepository;
  }

  async execute(credentials) {
    const session = await this.authRepository.login(credentials);
    await this.sessionRepository.saveSession(session);
    return session;
  }
}