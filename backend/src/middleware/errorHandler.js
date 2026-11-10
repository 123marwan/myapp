function notFoundHandler(_req, res) {
  res.status(404).json({ message: "Not found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "حدث خطأ في السيرفر" : err.message || "Request failed";

  if (statusCode === 500 && process.env.NODE_ENV !== "test") {
    console.error("Server error:", err);
  }

  res.status(statusCode).json({ message });
}

module.exports = { notFoundHandler, errorHandler };