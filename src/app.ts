import express, { Application } from 'express';
import 'dotenv/config';

import connectDB from './db/index';
import { routeIndex } from './routes/index';

// Middleware & Utilities
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import logger from './middleware/logger';
import passport from './middleware/auth';
import { apiLimiter } from './middleware/rateLimiting';
// 

const app: Application = express();

// Instantiate middlewares
app.use(express.json());
app.use(helmet());
app.use(cors({
  optionsSuccessStatus: 200
}));
app.use(morgan('combined'));
app.use(passport.initialize());
app.use(apiLimiter);

// Create DB connection.
connectDB();

// Load imported index routes.
app.use(routeIndex);

// Run the application
const port: number = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  logger.log('info', `Server is running on :${port}`);
});

// Export app for testing.
export default app;