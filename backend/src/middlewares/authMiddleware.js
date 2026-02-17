const jwt = require("jsonwebtoken");
const authMiddleware = (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return response.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split("")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded; // attach user info to request
  } catch (error) {
    return response.status(401).json({ message: "Invalid or expired token" });
  }
};
module.exports = authMiddleware;
