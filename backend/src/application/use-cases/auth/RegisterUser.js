const { ValidationError } = require("../../../domain/errors/AppError");

const ALLOWED_AVATARS = new Set(["🦊", "🐼", "🐯", "🦁", "🐨", "🐸", "🦉", "🐙", "🦄", "🐳", "🐝", "🦋"]);
const ALLOWED_GENDERS = new Set(["male", "female"]);
const PHONE_PATTERN = /^[0-9]{7,15}$/;

class RegisterUser {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute(input) {
    const payload = this.#normalize(input);
    this.#validate(payload);

    const existing = await this.userRepository.findByEmail(payload.email);
    if (existing) {
      throw new ValidationError("Email already registered");
    }

    const passwordHash = await this.passwordHasher.hash(payload.password);
    const user = await this.userRepository.create({ ...payload, password: passwordHash });
    const token = this.tokenService.sign({ id: user.id });

    return { user, token };
  }

  #normalize(input = {}) {
    return {
      name: String(input.name || "").trim(),
      email: String(input.email || "").trim().toLowerCase(),
      password: String(input.password || ""),
      phone: String(input.phone || "").trim(),
      gender: String(input.gender || "").trim(),
      avatar: String(input.avatar || "").trim(),
    };
  }

  #validate(payload) {
    if (!payload.name || !payload.email || !payload.password || !payload.phone || !payload.gender || !payload.avatar) {
      throw new ValidationError("من فضلك اكمل كل الحقول المطلوبة");
    }
    if (!ALLOWED_AVATARS.has(payload.avatar)) {
      throw new ValidationError("اختار الأفاتار بتاعك");
    }
    if (!PHONE_PATTERN.test(payload.phone)) {
      throw new ValidationError("رقم التليفون غير صحيح");
    }
    if (!ALLOWED_GENDERS.has(payload.gender)) {
      throw new ValidationError("الجندر غير صحيح");
    }
    if (payload.password.length < 6) {
      throw new ValidationError("الباسورد لازم يكون 6 حروف على الأقل");
    }
  }
}

module.exports = { RegisterUser };