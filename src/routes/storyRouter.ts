import passport from 'passport';
import { Router } from 'express';
import {
  getStory,
  deleteStory
} from '../handlers/storyHandler';

const router = Router();

router.get('/:storyID', getStory);
router.delete(
  '/:storyID',
  passport.authenticate('jwt', { session: false }),
  deleteStory
)

export { router as storyRoutes }; 
