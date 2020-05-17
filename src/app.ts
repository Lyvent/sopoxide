import express, { Application, Request, Response } from 'express';
import mongoose, { ConnectionOptions } from 'mongoose';

const app: Application = express();

// Connect to MongoDB
const URI: string = 'mongodb://localhost/lyventdb';
const DBOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(URI, DBOptions, () => {
  console.log('Connected to DB');
});

// Run the application
const port: number = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server is running on :${port}`);
});
