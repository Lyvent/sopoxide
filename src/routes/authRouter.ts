import { Router } from 'express';
import AuthHandler from '../handlers/authHandler';

import {
  logInLimiter,
  signUpLimiter
} 
from '../middleware/rateLimiting';

const router = Router();
const handler = new AuthHandler();

router.post('/login', logInLimiter, handler.logIn);
router.post('/signup', signUpLimiter, handler.signUp);
/* TEMPORARILY UNAVAILABLE.
router.post('/google', handler.google);
*/

export { router as authRoutes };