export class ListUsers {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ token }) {
    return this.userRepository.listUsers(token);
  }
}