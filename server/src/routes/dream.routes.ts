import { Router } from "express";
import {
  submitDream,
  completeAction,
  getUserDreams,
  getDreamById,
  deleteDream,
  startReflection,
  audioTranscribe,
} from "../controllers/dream.controller";

const router = Router();

router.post("/audio-transcribe", audioTranscribe);

router.post("/dream", submitDream);

router.get("/dreams", getUserDreams);

router.get("/dream/:dreamId", getDreamById);

router.delete("/dream/:dreamId", deleteDream);

router.post("/start-reflection", startReflection);

router.post("/dream/complete", completeAction);

export default router;
