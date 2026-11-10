const express = require("express");
const { createAuthRoutes } = require("./authRoutes");
const { createUserRoutes } = require("./userRoutes");

function createApiRouter({ authMiddleware, config }) {
  const router = express.Router();

  router.use(createAuthRoutes(config));
  router.use(createUserRoutes(authMiddleware));

  return router;
}

module.exports = { createApiRouter };