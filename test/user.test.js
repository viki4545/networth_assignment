import { createUser } from "../src/controllers/userController.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "../src/createServer.js";

dotenv.config();

let server;
let token;

beforeAll(async () => {
  // Connect to the MongoDB test database
  await mongoose.connect(process.env.MONGO_URI);

  // Create and initialize the Hapi server
  server = await createServer();

  // Create a user for login tests
  await server.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      fullName: "Login User",
      email: "loginuser@example.com",
      password: "testpass123",
      ssn: "123456789",
    },
  });

  // Log in the test user and extract the auth token
  const res = await server.inject({
    method: "POST",
    url: "/api/login",
    payload: {
      email: "loginuser@example.com",
      password: "testpass123",
    },
  });

  token = JSON.parse(res.payload).token; // Save token for authenticated requests
});

afterAll(async () => {
  // Disconnect from MongoDB after tests finish
  await mongoose.disconnect();
});

test("Should create a user successfully", async () => {
  const request = {
    payload: {
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      ssn: "123456789",
    },
  };

  // Mock Hapi response object
  const h = {
    response: (data) => ({
      code: () => data,
    }),
  };

  const result = await createUser(request, h);

  // Verify that user creation succeeded
  expect(result.message).toBe("User created successfully");
});

test("should return 400 if email is missing", async () => {
  // Missing email field
  const res = await server.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      fullName: "John Doe",
      password: "secret123",
      ssn: "999999999",
    },
  });

  expect(res.statusCode).toBe(400);
  expect(JSON.parse(res.payload).error).toMatch(/"email" is required/);
});

test("should not allow duplicate email", async () => {
  const payload = {
    fullName: "Jane Doe",
    email: "jane@example.com",
    password: "secure123",
    ssn: "999999999",
  };

  // First attempt (should succeed)
  await server.inject({ method: "POST", url: "/api/users", payload });

  // Second attempt (should fail due to duplicate)
  const res = await server.inject({
    method: "POST",
    url: "/api/users",
    payload,
  });

  expect(res.statusCode).toBe(409); // Conflict due to duplicate email
});

test("should login successfully with correct credentials", async () => {
  const res = await server.inject({
    method: "POST",
    url: "/api/login",
    payload: {
      email: "loginuser@example.com",
      password: "testpass123",
    },
  });

  const data = JSON.parse(res.payload);

  expect(res.statusCode).toBe(200);
  expect(data.message).toBe("Login successful");
  expect(data.token).toBeDefined();
});

test("should fetch all users when authenticated", async () => {
  const res = await server.inject({
    method: "GET",
    url: "/api/users",
    headers: {
      Authorization: `Bearer ${token}`, // Include valid token in header
    },
  });

  const data = JSON.parse(res.payload);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(data)).toBe(true); // Expecting list of users
});
