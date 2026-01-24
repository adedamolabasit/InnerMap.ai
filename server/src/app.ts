import express from 'express';
import cors from 'cors';
import dreamRoutes from './routes/dream.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', dreamRoutes);

export default app;
