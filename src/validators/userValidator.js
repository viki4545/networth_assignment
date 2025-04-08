import Joi from "joi";

/**
 * Joi schema for validating user input during registration
 */
export const userSchema = Joi.object({
  // Full name must be a string and is required
  fullName: Joi.string().required(),

  // Email must be a valid email format and is required
  email: Joi.string().email().required(),

  // Password must be a string with a minimum length of 6 characters and is required
  password: Joi.string().min(6).required(),

  // SSN (Social Security Number or similar PII) is optional, but if provided, must be at least 9 characters
  ssn: Joi.string().min(9).optional(),
});
