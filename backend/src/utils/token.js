const jwt = require("jsonwebtoken");

function signAuthToken(userId, secret, expiresIn) {
  return jwt.sign({ id: userId }, secret, { expiresIn });
}

function verifyAuthToken(token, secret) {
  return jwt.verify(token, secret);
}

module.exports = { signAuthToken, verifyAuthToken };