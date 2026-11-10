const { UnauthorizedError } = require("../../../domain/errors/AppError");

function createAuthMiddleware(tokenService) {
  return function authMiddleware(req, _res, next) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    try {
      const payload = tokenService.verify(token);
      req.userId = payload.id;
      return next();
    } catch {
      return next(new UnauthorizedError("Unauthorized"));
    }
  };
}

module.exports = { createAuthMiddleware };