import mongoose from "mongoose";

// Define the User schema using Mongoose
const userSchema = new mongoose.Schema(
  {
    // Full name of the user - required field
    fullName: {
      type: String,
      required: true,
    },

    // Email address of the user - required and must be unique
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Hashed password of the user - required
    password: {
      type: String,
      required: true,
    },

    // Encrypted Social Security Number (simulated PII) - optional
    ssn: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the User model for use in controllers and services
export default mongoose.model("User", userSchema);
