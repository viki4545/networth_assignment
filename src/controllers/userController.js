import User from "../models/User.js"; // Import the User model
import { hashPassword, encryptPII } from "../utils/encrypt.js"; // Utility for hashing and encrypting sensitive data
import { decryptPII } from "../utils/encrypt.js"; // Utility for decrypting sensitive data

// Controller to handle user creation (registration)
export const createUser = async (request, h) => {
  try {
    const { fullName, email, password, ssn } = request.payload; // Extract user data from request

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Conflict: Email already registered
      return h
        .response({ error: "User with this email already exists" })
        .code(409);
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    // Encrypt the SSN (sensitive data) before storing
    const encryptedSSN = encryptPII(ssn);

    // Create a new user instance
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      ssn: encryptedSSN,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return a success response with created user ID
    return h
      .response({ id: savedUser._id, message: "User created successfully" })
      .code(201);
  } catch (error) {
    // Internal Server Error
    return h.response({ error: error.message }).code(500);
  }
};

// Controller to fetch all users (admin or authorized usage)
export const getAllUsers = async (request, h) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Decrypt SSN and sanitize output
    const sanitizedUsers = users.map((user) => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      ssn: decryptPII(user.ssn), // Decrypt sensitive SSN before sending
    }));

    // Return the sanitized user list
    return h.response(sanitizedUsers).code(200);
  } catch (error) {
    // Internal Server Error
    return h.response({ error: error.message }).code(500);
  }
};
