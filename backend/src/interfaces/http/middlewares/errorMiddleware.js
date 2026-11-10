const { AppError } = require("../../../domain/errors/AppError");

function notFoundMiddleware(_req, res) {
  res.status(404).json({ message: "Not found" });
}

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, _req, res, _next) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "حدث خطأ في السيرفر";

  if (!isAppError && process.env.NODE_ENV !== "test") {
    console.error("Unexpected error:", err);
  }

  res.status(statusCode).json({ message });
}

module.exports = { notFoundMiddleware, errorMiddleware };