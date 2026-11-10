export class RestoreSession {
  constructor({ sessionRepository }) {
    this.sessionRepository = sessionRepository;
  }

  async execute() {
    return this.sessionRepository.getSession();
  }
}