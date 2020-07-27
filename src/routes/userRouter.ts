import { Router } from 'express';
import UserHandler from '../handlers/userHandler';

const router = Router();
const handler = new UserHandler();

router.get('/:username', handler.get);

export { router as userRoutes };