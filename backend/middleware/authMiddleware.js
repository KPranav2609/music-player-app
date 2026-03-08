import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();

export const protect = async (req, res, next) => {
  // Authentication middleware logic will be implemented here
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, no token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    console.log("Decoded token:", decoded);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized access, user not found" });
    }
    req.user = user; // Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized access, invalid token" });
  }
};
