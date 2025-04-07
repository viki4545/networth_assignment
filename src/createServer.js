import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import Inert from "@hapi/inert";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/database.js";

dotenv.config();

export const createServer = async () => {
  await connectDB();

  const server = Hapi.server({
    port: process.env.PORT || 5000, // This is fine, it won’t bind unless you call start()
    host: "localhost",
    routes: { cors: true },
  });

  await server.register(Inert);
  server.route(userRoutes);

  return server; // do not call server.start()
};
