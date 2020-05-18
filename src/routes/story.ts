import { Router, Request, Response } from 'express';
// import Story from "../models/Story";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200);
  res.send('Henlo friend.');
});

router.post('/create', (req: Request, res: Response) => {
  const name: string = req.body.name;
  res.send(`Hello ${name}`);
});

export { router as storyRoutes }; 
