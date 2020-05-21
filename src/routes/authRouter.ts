import { Router } from 'express';
import { logIn, signUp } from '../handlers/authHandler';

const router = Router();

router.post('/login', logIn);
router.post('/signup', signUp);

export { router as authRoutes };