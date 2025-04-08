import Hapi from "@hapi/hapi"; // Core Hapi.js framework
import dotenv from "dotenv"; // Load environment variables from .env file
import Inert from "@hapi/inert"; // Plugin for serving static files
import HapiJWT from "@hapi/jwt"; // JWT plugin for authentication
import HapiRateLimit from "hapi-rate-limit"; // Rate limiting plugin

import userRoutes from "./routes/userRoutes.js"; // User routes (login, register, etc.)
import connectDB from "./config/database.js"; // MongoDB connection function

dotenv.config(); // Load env variables (e.g., JWT_SECRET, DB credentials)

export const createServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Create Hapi server instance with CORS enabled
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: "localhost",
    routes: { cors: true },
  });

  // Register all necessary plugins
  await server.register([
    Inert, // Static file serving support (if needed in the future)
    HapiJWT, // JWT authentication support
    {
      plugin: HapiRateLimit, // Rate limiter to prevent abuse
      options: {
        userLimit: 5, // Max 5 requests per user per minute globally (can be overridden per route)
        userPathLimit: false, // Disable per-user-per-path rate limit globally
        pathLimit: false, // Disable per-path limit globally
        trustProxy: false, // Set true if behind a reverse proxy
      },
    },
  ]);

  // Define JWT authentication strategy
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET || "default_jwt_secret", // JWT secret key (fallback provided)
    verify: {
      aud: false, // Disable audience verification
      iss: false, // Disable issuer verification
      sub: false, // Disable subject verification
      nbf: true, // Check "not before" claim
      exp: true, // Check token expiry
      maxAgeSec: 14400, // Max token age = 4 hours
      timeSkewSec: 15, // Allow 15 seconds clock skew for safer validation
    },
    validate: async (artifacts, request, h) => {
      // Always mark token as valid and attach decoded user data
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload },
      };
    },
  });

  // Optional: Set JWT as the default auth strategy for all routes
  server.auth.default("jwt");

  // Register application routes (user login, register, fetch, etc.)
  server.route(userRoutes);

  // Return configured server instance (to be started in another file or test)
  return server;
};
