const express = require("express");
const cors = require("cors");

const { createApiRoutes } = require("../interfaces/http/routes");
const { notFoundMiddleware, errorMiddleware } = require("../interfaces/http/middlewares/errorMiddleware");
const { buildContainer } = require("./container");

function createApp(config) {
  const app = express();
  const container = buildContainer(config);

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", createApiRoutes(container));

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };