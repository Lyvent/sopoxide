import express, { Application } from 'express';
import 'dotenv/config';

// Middleware
import bodyParser from 'body-parser';
import corsMiddleware from './middleware/cors';

import connectDB from './db/index';

const app: Application = express();

// Instantiate Middlewares
app.use(bodyParser.json());
app.use(corsMiddleware);

// Create DB connection.
connectDB();

// Import Routes
// TODO: Add Route middleware that is imported for this module (app.ts).
import { storyRoutes } from './routes/story';

app.use('/story', storyRoutes);

// Run the application
const port: number = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server is running on :${port}`);
});
