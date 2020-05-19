import express, { Application } from 'express';
import 'dotenv/config';

// Middleware
import helmet from 'helmet';
import morgan from 'morgan';

import cors from 'cors';
import corsOptions from './middlewares/corsOptions';

import connectDB from './db/index';

const app: Application = express();

// Instantiate Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));

// Create DB connection.
connectDB();

// Import Routes
// TODO: Add route index that can be imported once for all routes.
import { storyRoutes } from './routes/storyRoute';
import { authRoutes } from './routes/authRoute';

app.use('/story', storyRoutes);
app.use('/auth', authRoutes);

// Run the application
const port: number = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server is running on :${port}`);
});

// Export app for testing.
export default app;
