const { UserRepository } = require("../../domain/repositories/UserRepository");
const UserModel = require("../database/models/UserModel");

function toDomainUser(doc) {
  if (!doc) return null;
  const source = typeof doc.toObject === "function" ? doc.toObject() : doc;

  return {
    id: String(source._id),
    name: source.name || "",
    email: source.email || "",
    password: source.password || "",
    phone: source.phone || "",
    gender: source.gender || "",
    avatar: source.avatar || "",
    createdAt: source.createdAt || null,
  };
}

class MongoUserRepository extends UserRepository {
  async findByEmail(email) {
    const doc = await UserModel.findOne({ email });
    return toDomainUser(doc);
  }

  async findById(id) {
    const doc = await UserModel.findById(id);
    return toDomainUser(doc);
  }

  async create(data) {
    const doc = await UserModel.create(data);
    return toDomainUser(doc);
  }

  async list() {
    const docs = await UserModel.find().sort({ createdAt: -1 });
    return docs.map(toDomainUser);
  }
}

module.exports = { MongoUserRepository };