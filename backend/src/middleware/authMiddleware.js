const { verifyAuthToken } = require("../utils/token");
const { createHttpError } = require("../utils/httpError");

function createAuthMiddleware(jwtSecret) {
  return function authMiddleware(req, _res, next) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(createHttpError(401, "Unauthorized"));
    }

    try {
      const payload = verifyAuthToken(token, jwtSecret);
      req.userId = payload.id;
      return next();
    } catch {
      return next(createHttpError(401, "Unauthorized"));
    }
  };
}

module.exports = { createAuthMiddleware };