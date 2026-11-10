const { NotFoundError } = require("../../../domain/errors/AppError");

class GetCurrentUser {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ userId }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("المستخدم غير موجود");
    }
    return user;
  }
}

module.exports = { GetCurrentUser };