import passport from 'passport';
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }),(req: Request, res: Response) => {
  res.status(200);
  res.send('Henlo friend.');
});

router.post('/create', (req: Request, res: Response) => {
  const name: string = req.body.name;
  res.send(`Hello ${name}`);
});

export { router as storyRoutes }; 
