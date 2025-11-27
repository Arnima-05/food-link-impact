import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import donationsRouter from './routes/donations.js';
import profilesRouter from './routes/profiles.js';
import matchesRouter from './routes/matches.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'Food Link Impact API' });
});

const MONGO_URL = process.env.MONGODB_URL || process.env.MONGO_URL || 'mongodb://localhost:27017/food_link_impact';
const PORT = process.env.PORT || 8080;

console.log(`Connecting to MongoDB at ${MONGO_URL}`);
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Continuing to run API server without DB connection.');
  });

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/donations', donationsRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/matches', matchesRouter);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
