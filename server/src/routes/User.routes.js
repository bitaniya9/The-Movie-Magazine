const UserController = require("../controllers/user.controllers");
const authMiddleware = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
router.post("/v1/users/signin", UserController.signUp);
router.post("/v1/users/login", UserController.login);
router.get("/v1/users/profile", authMiddleware, UserController.getProfile);
router.put(
  "/v1/users/watchlist",
  authMiddleware,
  UserController.handleToggleWatchlist,
);
router.put(
  "/v1/users/favorites",
  authMiddleware,
  UserController.handleToggleFavorite,
);

module.exports = router;
