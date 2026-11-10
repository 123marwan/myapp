function toPublicUser(user) {
  if (!user) return null;

  return {
    id: String(user._id || user.id),
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "",
    avatar: user.avatar || "",
    createdAt: user.createdAt || null,
  };
}

module.exports = { toPublicUser };