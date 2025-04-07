import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import Inert from "@hapi/inert";
import HapiRateLimit from "hapi-rate-limit";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const init = async () => {
  await connectDB();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: "localhost",
    routes: { cors: true },
  });

  await server.register([
    Inert,
    {
      plugin: HapiRateLimit,
      options: {
        userLimit: 10,
        pathLimit: false,
        enabled: true,
        trustProxy: true,
      },
    },
  ]);

  server.route(userRoutes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

init();
