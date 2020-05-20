import express, { Router, Response } from 'express';
import { signUp } from '../handlers/authHandler';

const router = Router();

router.post('/login', async (req: express.Request, res: Response) => {
  // TODO: Implement passport login method.
  res.json({
    message: 'Hey, nothing here yet.'
  })
});

router.post('/signup', signUp);

export { router as authRoutes };