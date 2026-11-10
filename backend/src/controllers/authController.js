const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { isValidAvatar } = require("../constants/avatars");
const { createHttpError } = require("../utils/httpError");
const { signAuthToken } = require("../utils/token");
const { toPublicUser } = require("../utils/userMapper");

const GENDERS = new Set(["male", "female"]);
const PHONE_PATTERN = /^[0-9]{7,15}$/;

function normalizeRegisterInput(body = {}) {
  return {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim().toLowerCase(),
    password: String(body.password || ""),
    phone: String(body.phone || "").trim(),
    gender: String(body.gender || "").trim(),
    avatar: String(body.avatar || "").trim(),
  };
}

function validateRegisterInput(input) {
  if (!input.name || !input.email || !input.password || !input.phone || !input.gender || !input.avatar) {
    throw createHttpError(400, "من فضلك اكمل كل الحقول المطلوبة");
  }
  if (!isValidAvatar(input.avatar)) {
    throw createHttpError(400, "اختار الأفاتار بتاعك");
  }
  if (!PHONE_PATTERN.test(input.phone)) {
    throw createHttpError(400, "رقم التليفون غير صحيح");
  }
  if (!GENDERS.has(input.gender)) {
    throw createHttpError(400, "الجندر غير صحيح");
  }
  if (input.password.length < 6) {
    throw createHttpError(400, "الباسورد لازم يكون 6 حروف على الأقل");
  }
}

function createAuthController({ jwtSecret, jwtExpiresIn }) {
  async function register(req, res) {
    const input = normalizeRegisterInput(req.body);
    validateRegisterInput(input);

    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw createHttpError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await User.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      gender: input.gender,
      avatar: input.avatar,
    });

    const token = signAuthToken(user._id, jwtSecret, jwtExpiresIn);
    res.status(201).json({ token, user: toPublicUser(user) });
  }

  async function login(req, res) {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      throw createHttpError(400, "من فضلك اكتب الإيميل والباسورد");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(400, "الإيميل ده مش مسجل عندنا");
    }

    let passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches && password.trim() !== password) {
      passwordMatches = await bcrypt.compare(password.trim(), user.password);
    }
    if (!passwordMatches) {
      throw createHttpError(400, "الباسورد غير صحيح");
    }

    const token = signAuthToken(user._id, jwtSecret, jwtExpiresIn);
    res.json({ token, user: toPublicUser(user) });
  }

  return { register, login };
}

module.exports = { createAuthController };