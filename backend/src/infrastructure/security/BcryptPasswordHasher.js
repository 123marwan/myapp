const bcrypt = require("bcryptjs");
const { PasswordHasher } = require("../../application/ports/PasswordHasher");

class BcryptPasswordHasher extends PasswordHasher {
  constructor(saltRounds = 10) {
    super();
    this.saltRounds = saltRounds;
  }

  hash(plain) {
    return bcrypt.hash(String(plain), this.saltRounds);
  }

  compare(plain, hashed) {
    return bcrypt.compare(String(plain), String(hashed));
  }
}

module.exports = { BcryptPasswordHasher };