import { Router } from 'express';
import AuthHandler from '../handlers/authHandler';

const router = Router();
const handler = new AuthHandler();

router.post('/login', handler.logIn);
router.post('/signup', handler.signUp);

export { router as authRoutes };