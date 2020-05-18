import express, { Application } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';

import connectDB from './db/index';

const app: Application = express();

// Middlewares
app.use(bodyParser.json());

// Instantiate DB connection.
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
