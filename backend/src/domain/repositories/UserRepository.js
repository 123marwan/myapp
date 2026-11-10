/**
 * UserRepository port (interface).
 * Infrastructure must provide an implementation with these methods.
 */
class UserRepository {
  async findByEmail(_email) {
    throw new Error("UserRepository.findByEmail not implemented");
  }

  async findById(_id) {
    throw new Error("UserRepository.findById not implemented");
  }

  async create(_userData) {
    throw new Error("UserRepository.create not implemented");
  }

  async list() {
    throw new Error("UserRepository.list not implemented");
  }
}

module.exports = { UserRepository };