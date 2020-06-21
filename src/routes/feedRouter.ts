import { Router } from 'express';
import FeedHandler from '../handlers/feedHandler';

const router = Router();
const handler = new FeedHandler();

router.get('/stories', handler.stories);

export { router as feedRoutes };