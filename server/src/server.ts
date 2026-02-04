import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './db';

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`🚀 InnerMap API running on port ${process.env.PORT}`);
});
