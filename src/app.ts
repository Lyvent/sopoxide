import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.send("Hello World!");
});

// TODO: Get port from environment variables.
const port: number = 5000;

// Run the application
app.listen(port, () => {
  console.log(`Server is running on :${port}`);
});
