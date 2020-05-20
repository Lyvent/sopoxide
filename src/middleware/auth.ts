import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';

import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
  Strategy,
  VerifyCallback
} from 'passport-jwt';

import User, { UserDoc } from '../models/User';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

const verify: VerifyCallback = async (payload, done) => {
  await User.findOne({ _id: payload.sub }, (err, res) => {
    res ? done(null, res) : done(err, null); 

  }).catch(err => done(err, null));
};

const strategy: Strategy = new JWTStrategy(options, verify);

// Issue a JWT Token
interface JWTData {
  token: string;
  expires: string;
}

const issueJWT = (user: UserDoc): JWTData => {
  const _id = user._id;
  const expiresIn = '1d';

  // IMPORTANT: Set JWT_SECRET in dotenv!
  const secret: string = process.env.JWT_SECRET || 'ch4ngeInPr0d';

  // Create JWT Payload.
  const payload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000)
  }

  const signedToken = jsonwebtoken.sign(payload, secret, {
    expiresIn: expiresIn
  })

  return {
    token: signedToken,
    expires: expiresIn,
  }
}

export default passport.use(strategy);
export { issueJWT, JWTData };