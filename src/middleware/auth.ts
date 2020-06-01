import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';

import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
  Strategy,
  VerifyCallback
} from 'passport-jwt';

import { OAuth2Client, TokenPayload } from 'google-auth-library';

import User, { UserDoc } from '../models/User';

// Google Verify
class VerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VerificationError';
  }
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = new OAuth2Client(CLIENT_ID);

const verifyGoogleIDToken = async (token: string): Promise<TokenPayload | undefined> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });   

    const payload = ticket.getPayload();
    return payload;

  } catch (err) {
    throw new VerificationError(err);
  }
}

// Local JWT
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
export { issueJWT, JWTData, verifyGoogleIDToken, VerificationError };