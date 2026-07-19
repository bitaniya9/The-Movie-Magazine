const User = require("../models/User");

const adminMiddleware = async (request, response, next) => {
  const user = await User.findById(request.user.userId);
  if (!user || user.role !== "admin") {
    return response.status(403).json({ message: "Access denied.Admin only" });
  }
  next();
};
module.exports = adminMiddleware;
