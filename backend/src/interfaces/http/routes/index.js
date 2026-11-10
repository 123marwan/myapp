const express = require("express");
const { createAuthRoutes } = require("./authRoutes");
const { createUserRoutes } = require("./userRoutes");

function createApiRoutes({ authController, userController, authMiddleware }) {
  const router = express.Router();

  router.use(createAuthRoutes(authController));
  router.use(createUserRoutes({ userController, authMiddleware }));

  return router;
}

module.exports = { createApiRoutes };