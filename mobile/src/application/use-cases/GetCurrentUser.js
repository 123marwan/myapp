export class GetCurrentUser {
  constructor({ authRepository, sessionRepository }) {
    this.authRepository = authRepository;
    this.sessionRepository = sessionRepository;
  }

  async execute({ token }) {
    const user = await this.authRepository.getCurrentUser(token);
    await this.sessionRepository.saveUser(user);
    return user;
  }
}