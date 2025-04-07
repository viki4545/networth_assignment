import User from "../models/User.js";
import { hashPassword } from "../utils/encrypt.js";

export const createUser = async (request, h) => {
  try {
    const { fullName, email, password, ssn } = request.payload;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return h
        .response({ error: "User with this email already exists" })
        .code(409);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      ssn,
    });

    const savedUser = await newUser.save();

    return h.response({ id: savedUser._id, message: "User created" }).code(201);
  } catch (error) {
    return h.response({ error: error.message }).code(500);
  }
};
