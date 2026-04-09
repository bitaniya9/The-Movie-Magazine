const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  async signUp(userData) {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, //access token short lived
    );

    return {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  }
  async login(userData) {
    const { email, password } = userData;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
      {
        userId: user._id,
        userRole: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async addToWatchList(userId, movieId) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { watchlist: movieId } },
      { returnDocument: "after" },
    ).populate("watchlist");

    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser.watchlist;
  }
  async getProfile(userId) {
    const user = await User.findById(userId)
      .populate("watchlist")
      .select("-password")
      .select("-role");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
module.exports = new UserService();
