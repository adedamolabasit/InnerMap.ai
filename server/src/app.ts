import express from 'express';
import cors from 'cors';
import dreamRoutes from './routes/dream.routes';
import { identifyUser } from './middleware/identity.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use(identifyUser);
app.use('/api', dreamRoutes);

export default app;
