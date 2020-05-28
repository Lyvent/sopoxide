import passport from 'passport';
import { Router } from 'express';
import {
  createStory,
  getStory,
  updateStory,
  deleteStory
} from '../handlers/storyHandler';

const router = Router();

router.get('/:storyID', getStory);

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  createStory
);

router.put(
  '/update',
  passport.authenticate('jwt', { session: false }),
  updateStory
);

router.delete(
  '/:storyID',
  passport.authenticate('jwt', { session: false }),
  deleteStory
);

export { router as storyRoutes }; 
