const UserController = require("../controllers/user.controllers");
const express = require("express");
const router = express.Router();
router.post("/v1/users/signup", UserController.signUp);
router.post("/v1/users/login", UserController.login);
module.exports = router;
