const User = require("../models/User");
const { createHttpError } = require("../utils/httpError");
const { toPublicUser } = require("../utils/userMapper");

async function getCurrentUser(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    throw createHttpError(404, "المستخدم غير موجود");
  }
  res.json(toPublicUser(user));
}

async function listUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(toPublicUser));
}

module.exports = { getCurrentUser, listUsers };