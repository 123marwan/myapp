const express = require("express");
const { asyncHandler } = require("../middlewares/asyncHandler");

function createUserRoutes({ userController, authMiddleware }) {
  const router = express.Router();

  router.get("/me", authMiddleware, asyncHandler(userController.me));
  router.get("/users", authMiddleware, asyncHandler(userController.list));

  return router;
}

module.exports = { createUserRoutes };