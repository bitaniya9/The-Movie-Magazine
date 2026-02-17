const { email } = require("zod");
const User = require("../models/User");
const UserService = require("../services/user.services");
const { signUpSchema, loginSchema } = require("../validator/user.validator");
class UserController {
  async signUp(request, response) {
    try {
      const validatedData = signUpSchema.parse(request.body);
      const { token, user } = await UserService.signUp(validatedData);
      response.status(201).json({ token, user });
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
  async login(request, response) {
    try {
      const validatedData = loginSchema.parse(request.body);
      const { token, user } = await UserService.login(validatedData);
      response.status(200).json(token, user);
    } catch (error) {
      response.json({ message: error.message });
    }
  }
}
module.exports = new UserController();
