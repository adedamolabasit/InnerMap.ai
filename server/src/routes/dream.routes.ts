import { Router } from "express";
import {
  submitDream,
  completeAction,
  getUserDreams,
  getDreamById,
} from "../controllers/dream.controller";

const router = Router();

// Create / process dream
router.post("/dream", submitDream);

// Mark action as completed
router.post("/dream/complete", completeAction);

// 🔹 Get all dreams for a user
router.get("/dreams/:userId", getUserDreams);

// 🔹 Get a single dream by id
router.get("/dream/:dreamId", getDreamById);

export default router;
