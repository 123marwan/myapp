const express = require("express");
const cors = require("cors");
const { createAuthMiddleware } = require("./middleware/authMiddleware");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const { createApiRouter } = require("./routes");

function createApp(config) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const authMiddleware = createAuthMiddleware(config.jwtSecret);
  app.use("/api", createApiRouter({ authMiddleware, config }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };