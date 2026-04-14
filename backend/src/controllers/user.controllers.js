const { email } = require("zod");
const User = require("../models/User");
const UserService = require("../services/user.services");
const { signUpSchema, loginSchema } = require("../validator/user.validator");
const { response } = require("express");
class UserController {
  async signUp(request, response) {
    try {
      const validatedData = signUpSchema.parse(request.body);
      const { token, user } = await UserService.signUp(validatedData);
      response.status(201).json({ token, user });
    } catch (error) {
      if (error.errors) {
        return response.status(400).json({ message: error.errors[0].message });
      }
      response.status(401).json({ message: error.message });
    }
  }
  async login(request, response) {
    try {
      const validatedData = loginSchema.parse(request.body);
      const { token, user } = await UserService.login(validatedData);
      response.status(200).json({ token, user });
    } catch (error) {
      response.status(401).json({ message: error.message });
    }
  }
  async handleAddWatchlist(request, response) {
    try {
      const { movieId } = request.body;
      const userId = request.user.userId;
      const watchlist = await UserService.addToWatchList(userId, movieId);
      response.status(200).json(watchlist);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
  async getProfile(request, response) {
    try {
      const { userId } = request.user;
      const profile = await UserService.getProfile(userId);
      response.status(200).json(profile);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
}
module.exports = new UserController();
