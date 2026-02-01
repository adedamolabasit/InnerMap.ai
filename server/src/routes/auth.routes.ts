import { Router } from "express";
import { authTodoist, authTodoisCallback, getProfile } from "../controllers/auth.controller";

const router = Router();

router.get("/auth/todoist/:dreamId/:userId", authTodoist);

router.get("/auth/todoist/callback", authTodoisCallback);

router.get("/profile", getProfile);

export default router;