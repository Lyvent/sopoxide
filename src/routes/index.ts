// INFO: Index for route imports.
import { Router } from 'express';

import { authRoutes } from './authRouter';
import { feedRoutes } from './feedRouter';
import { storyRoutes } from './storyRouter';

const router = Router();

router.use('/auth', authRoutes);
router.use('/feed', feedRoutes);
router.use('/story', storyRoutes);

export { router as routeIndex };