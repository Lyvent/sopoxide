// INFO: Index for route imports.
import { Router } from 'express';

import { authRoutes } from './authRoute';
import { storyRoutes } from './storyRoute';

const router = Router();

router.use('/auth', authRoutes);
router.use('/story', storyRoutes);

export { router as routeIndex };