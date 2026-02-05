import express from "express";
import cors from "cors";
import dreamRoutes from "./routes/dream.routes";
import authRoutes from "./routes/auth.routes";
import { identifyUser } from "./middleware/identity.middleware";
import { rateLimiter } from "./middleware/rateLimeter.middleware";
import "dotenv/config";

require("dotenv").config();

const app = express();

const allowedOrigins = [
  process.env.ALLOWED_CLIENT_URL,
  "http://localhost:3000",
];

app.use(rateLimiter);

app.use(
  cors({
    origin: allowedOrigins as string[],
    credentials: true,
  }),
);

app.use(express.json());

app.use(identifyUser);

// authrnticatetoken middlewaare depends on identifUser token
// ------I comment this out so as to allow user use guest mode for the purpose of the hackathon. The integration works fine
// app.use(authenticateToken);

app.use("/api", dreamRoutes, authRoutes);

export default app;
