const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { getCurrentUser, listUsers } = require("../controllers/userController");

function createUserRoutes(authMiddleware) {
  const router = express.Router();

  router.get("/me", authMiddleware, asyncHandler(getCurrentUser));
  router.get("/users", authMiddleware, asyncHandler(listUsers));

  return router;
}

module.exports = { createUserRoutes };