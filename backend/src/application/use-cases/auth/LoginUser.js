const { ValidationError } = require("../../../domain/errors/AppError");

class LoginUser {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ email, password } = {}) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const rawPassword = String(password || "");

    if (!normalizedEmail || !rawPassword) {
      throw new ValidationError("من فضلك اكتب الإيميل والباسورد");
    }

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new ValidationError("الإيميل ده مش مسجل عندنا");
    }

    let matches = await this.passwordHasher.compare(rawPassword, user.password);
    if (!matches && rawPassword.trim() !== rawPassword) {
      matches = await this.passwordHasher.compare(rawPassword.trim(), user.password);
    }
    if (!matches) {
      throw new ValidationError("الباسورد غير صحيح");
    }

    const token = this.tokenService.sign({ id: user.id });
    return { user, token };
  }
}

module.exports = { LoginUser };