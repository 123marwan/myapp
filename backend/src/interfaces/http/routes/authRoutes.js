const express = require("express");
const { asyncHandler } = require("../middlewares/asyncHandler");

function createAuthRoutes(authController) {
  const router = express.Router();

  router.post("/register", asyncHandler(authController.register));
  router.post("/login", asyncHandler(authController.login));

  return router;
}

module.exports = { createAuthRoutes };