// Import controller functions
import { createUser, getAllUsers } from "../controllers/userController.js";
import { loginUser } from "../controllers/authController.js";

// Import validation schema for user creation
import { userSchema } from "../validators/userValidator.js";

// Export route definitions
export default [
  // Route: Create a new user
  {
    method: "POST",
    path: "/api/users",
    options: {
      auth: false, // Public route - No authentication required

      // Validate request payload using Joi schema
      validate: {
        payload: userSchema,
        // Return 400 error with message on validation failure
        failAction: (request, h, err) => {
          return h
            .response({ error: err.details[0].message })
            .takeover()
            .code(400);
        },
      },

      // Rate limiting: max 5 requests per minute per user+path
      plugins: {
        "hapi-rate-limit": {
          userLimit: 5,
          expiresIn: 60 * 1000, // 1 minute
          errorMessage: "Too many requests, please try again in a minute",
        },
      },
    },

    // Handler with rate limit headers in response
    handler: async (request, h) => {
      const rateInfo = request.plugins["hapi-rate-limit"];

      return h
        .response({ message: "Created user" })
        .header("X-RateLimit-Remaining", rateInfo?.userPathRemaining ?? 0)
        .header("X-RateLimit-Reset", rateInfo?.userPathReset ?? 0)
        .code(201);
    },
  },

  // Route: User login
  {
    method: "POST",
    path: "/api/login",
    options: {
      auth: false, // Public route - No authentication required

      // Rate limiting: max 5 login attempts per minute per user+path
      plugins: {
        "hapi-rate-limit": {
          userLimit: 5,
          expiresIn: 60 * 1000, // 1 minute
          errorMessage: "Too many requests, please try again in a minute",
        },
      },
    },

    handler: loginUser, // Call login controller
  },

  // Route: Get all users (protected)
  {
    method: "GET",
    path: "/api/users",
    options: {
      auth: "jwt", // Protected route - JWT authentication required

      // Rate limiting: max 5 requests per minute per user+path
      plugins: {
        "hapi-rate-limit": {
          userLimit: 5,
          expiresIn: 60 * 1000, // 1 minute
          errorMessage: "Too many requests, please try again in a minute",
        },
      },
    },

    handler: getAllUsers, // Call getAllUsers controller
  },
];
