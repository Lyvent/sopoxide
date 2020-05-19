import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
  Strategy,
  VerifyCallback
} from 'passport-jwt';

import User from '../models/User';
import passport from 'passport';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['RS256']
}

const verify: VerifyCallback = (payload, done) => {
  User.findOne({ })
};

const strategy: Strategy = new JWTStrategy(options, verify);

export default passport.use(strategy);
