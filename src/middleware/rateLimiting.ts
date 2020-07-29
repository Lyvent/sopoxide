// @TODO: Implement rate limiting for global and specific routes.
import rateLimit from 'express-rate-limit';
import minutes from '../helpers/minutes';

// Default route limit
export const apiLimiter = rateLimit({
  windowMs: minutes(10),
  max: 200,
  message: 'Too many requests, please wait.'
});

export const logInLimiter = rateLimit({
  // 5 attempts every n minutes for logging in.
  windowMs: minutes(15),
  max: 5,
  message: 'Too many login attempts, please try again later.'
});

export const signUpLimiter = rateLimit({
  // 2 attempts to register every minute.
  windowMs: minutes(1),
  max: 2,
  message: 'Too many signup attempts, please wait.'
});