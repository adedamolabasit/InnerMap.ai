import { Router } from "express";
import { authLogin, authTodoist, authTodoisCallback, getProfile } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/login", authLogin);

router.get("/auth/todoist/:dreamId/:userId", authTodoist);

router.get("/auth/todoist/callback", authTodoisCallback);

router.get("/profile", getProfile);

export default router;