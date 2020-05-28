import passport from 'passport';
import { Router } from 'express';
import StoryHandler from '../handlers/storyHandler';

const router = Router();
const handler = new StoryHandler();

router.get('/:storyID', handler.get);

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  handler.create
);

router.put(
  '/update',
  passport.authenticate('jwt', { session: false }),
  handler.update
);

router.delete(
  '/:storyID',
  passport.authenticate('jwt', { session: false }),
  handler.update
);

export { router as storyRoutes }; 
