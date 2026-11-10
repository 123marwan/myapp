const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { createAuthController } = require("../controllers/authController");

function createAuthRoutes(config) {
  const router = express.Router();
  const controller = createAuthController(config);

  router.post("/register", asyncHandler(controller.register));
  router.post("/login", asyncHandler(controller.login));

  return router;
}

module.exports = { createAuthRoutes };