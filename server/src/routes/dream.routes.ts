import { Router } from 'express';
import { submitDream } from '../controllers/dream.controller';

const router = Router();

router.post('/dream', submitDream);

export default router;
