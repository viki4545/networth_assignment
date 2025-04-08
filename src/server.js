// Import core and third-party dependencies
import Hapi from "@hapi/hapi"; // Core Hapi framework
import dotenv from "dotenv"; // Load environment variables from .env file
import Inert from "@hapi/inert"; // Required for serving static files (optional plugin)
import HapiRateLimit from "hapi-rate-limit"; // Rate limiting plugin
import Jwt from "@hapi/jwt"; // JWT authentication plugin

// Import custom modules
import connectDB from "./config/database.js"; // MongoDB connection setup
import userRoutes from "./routes/userRoutes.js"; // User-related routes

// Load environment variables
dotenv.config();

// Async function to initialize and start the Hapi server
const init = async () => {
  // Connect to MongoDB
  await connectDB();

  // Create Hapi server instance with CORS enabled
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: "localhost",
    routes: { cors: true },
  });

  // Register required plugins
  await server.register([
    Inert, // For serving static files, e.g., images or downloads
    Jwt, // Enables JWT-based authentication

    // Configure Hapi Rate Limit
    {
      plugin: HapiRateLimit,
      options: {
        userLimit: 5, // Global: Max 5 requests per minute per authenticated user
        userPathLimit: false, // Route-level limits will override this if defined
        pathLimit: false, // No rate limiting per path unless explicitly set in route
        trustProxy: false, // Set to true if behind a proxy/load balancer
      },
    },
  ]);

  // Define JWT authentication strategy
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET || "defaultSecretKey", // Secret key for signing tokens

    // JWT claim validations
    verify: {
      aud: false, // Don't check audience
      iss: false, // Don't check issuer
      sub: false, // Don't check subject
      nbf: true, // Check "not before"
      exp: true, // Check expiry
      maxAgeSec: 14400, // Token expires in 4 hours
    },

    // Custom validation logic
    validate: async (artifacts, request, h) => {
      return {
        isValid: true, // Always accept token if valid
        credentials: artifacts.decoded.payload, // Attach user payload to request.auth.credentials
      };
    },
  });

  // Set JWT as the default auth strategy (applies to all routes unless overridden)
  server.auth.default("jwt");

  // Register all user-related routes (including signup, login, etc.)
  server.route(userRoutes);

  // Start the server
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

// Start the initialization process
init();
