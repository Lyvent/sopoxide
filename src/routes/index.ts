// INFO: Index for route imports.
import { Router } from 'express';

import { authRoutes } from './authRouter';
import { storyRoutes } from './storyRouter';

const router = Router();

router.use('/auth', authRoutes);
router.use('/story', storyRoutes);

export { router as routeIndex };