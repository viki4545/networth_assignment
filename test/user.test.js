import { createUser } from "../src/controllers/userController.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "../src/createServer.js";
dotenv.config();

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  server = await createServer();
});

afterAll(async () => {
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
  const h = {
    response: (data) => ({
      code: () => data,
    }),
  };

  const result = await createUser(request, h);
  expect(result.message).toBe("User created");
});

test("should return 400 if email is missing", async () => {
  const res = await server.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      fullName: "John Doe",
      password: "secret123",
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
  };

  await server.inject({ method: "POST", url: "/api/users", payload });
  const res = await server.inject({
    method: "POST",
    url: "/api/users",
    payload,
  });

  expect(res.statusCode).toBe(409);
});
