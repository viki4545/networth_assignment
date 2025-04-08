import bcrypt from "bcryptjs"; // For password hashing
import crypto from "crypto"; // For encryption and decryption
import dotenv from "dotenv"; // For loading environment variables

dotenv.config();

// Encryption key for AES-256-CBC (must be 32 characters)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-char-key-here";
// Length of the Initialization Vector (IV)
const IV_LENGTH = 16;

/**
 * Hash a plain text password using bcrypt
 * @param {string} password - The user's plain password
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Generate a salt
  return await bcrypt.hash(password, salt); // Hash the password with the salt
};

/**
 * Compare a plain password with its hashed version
 * @param {string} password - Plain password input
 * @param {string} hashed - Hashed password from DB
 * @returns {Promise<boolean>} - True if matched, else false
 */
export const comparePassword = async (password, hashed) => {
  return await bcrypt.compare(password, hashed); // Compare plain and hashed password
};

/**
 * Encrypt sensitive data like SSN using AES-256-CBC
 * @param {string} text - Plain sensitive data
 * @returns {string} - Encrypted string in format: iv:encryptedText
 */
export const encryptPII = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH); // Create a random IV
  const cipher = crypto.createCipheriv(
    "aes-256-cbc", // Encryption algorithm
    Buffer.from(ENCRYPTION_KEY), // Secret key
    iv // Initialization vector
  );
  let encrypted = cipher.update(text); // Encrypt the data
  encrypted = Buffer.concat([encrypted, cipher.final()]); // Finalize encryption
  return iv.toString("hex") + ":" + encrypted.toString("hex"); // Return iv + encrypted
};

/**
 * Decrypt encrypted PII back to original form
 * @param {string} encryptedText - Encrypted string in format: iv:encryptedText
 * @returns {string} - Decrypted original value
 */
export const decryptPII = (encryptedText) => {
  const [ivHex, encryptedHex] = encryptedText.split(":"); // Split IV and encrypted text
  const iv = Buffer.from(ivHex, "hex"); // Convert IV from hex
  const encrypted = Buffer.from(encryptedHex, "hex"); // Convert encrypted data from hex
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc", // Decryption algorithm
    Buffer.from(ENCRYPTION_KEY), // Secret key
    iv // Same IV used during encryption
  );
  let decrypted = decipher.update(encrypted); // Decrypt data
  decrypted = Buffer.concat([decrypted, decipher.final()]); // Finalize decryption
  return decrypted.toString(); // Return original data
};
