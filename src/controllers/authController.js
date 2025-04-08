import User from "../models/User.js"; // Import the User model
import dotenv from "dotenv"; // Load environment variables
import { comparePassword } from "../utils/encrypt.js"; // Utility to compare hashed password
import Jwt from "@hapi/jwt"; // Hapi JWT module for generating tokens

dotenv.config(); // Initialize dotenv to use environment variables

// Login controller function
export const loginUser = async (request, h) => {
  const { email, password } = request.payload; // Extract email and password from request body

  // Find user by email
  const user = await User.findOne({ email });

  // If user doesn't exist, return unauthorized error
  if (!user) {
    return h.response({ error: "Invalid credentials" }).code(401);
  }

  // Compare provided password with hashed password stored in DB
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return h.response({ error: "Invalid credentials" }).code(401);
  }

  // Generate JWT token with user ID and email
  const token = Jwt.token.generate(
    { id: user._id, email: user.email }, // Payload
    {
      key: process.env.JWT_SECRET, // Secret key from .env
      algorithm: "HS256", // Algorithm used for signing
    }
  );

  // Return success response with token
  return h.response({ message: "Login successful", token }).code(200);
};
