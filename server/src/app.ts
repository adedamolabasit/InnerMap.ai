import express from "express";
import cors from "cors";
import dreamRoutes from "./routes/dream.routes";
import authRoutes from "./routes/auth.routes";
import { identifyUser } from "./middleware/identity.middleware";
import { authenticateToken } from "./middleware/authenticate.middleware";

const app = express();

app.use(cors());

app.use(express.json());

app.use(identifyUser);

// authrnticatetoken middlewaare depends on identifUser token
// app.use(authenticateToken);

app.use("/api", dreamRoutes, authRoutes);

export default app;
