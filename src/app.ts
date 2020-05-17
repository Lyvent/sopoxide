import express, { Application } from 'express';
import 'dotenv/config';

import makeDB from './db/index';

const app: Application = express();

// Instantiate DB connection.
makeDB();

// Import Routes
// TODO: Add Route middleware that is imported for this module (app.ts).
const storyRoutes = require('./routes/story');

app.use('/story', storyRoutes);

// Run the application
const port: number = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server is running on :${port}`);
});
