export class SignOut {
  constructor({ sessionRepository }) {
    this.sessionRepository = sessionRepository;
  }

  async execute() {
    await this.sessionRepository.clearSession();
  }
}