import { Request, Response } from 'express';
import { issueJWT, JWTData } from '../middleware/auth';
import { isEmpty, mapValues } from 'lodash';
import logger from '../middleware/logger';
import User from '../models/User';

import { badRequestResponse, serverErrResponse } from '../helpers/response';

interface AuthResponse {
  message: string;
  user: JSON;
  jwt: JWTData;
}

interface TokenData {
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

class AuthHandler {
  // google = async (req: Request, res: Response) => {
  //   // Grab json body content and check if it exists.
  //   const tokenData: TokenData = req.body;
  //   if (isEmpty(tokenData)) {
  //     return badRequestResponse(res, 'Token data not found!');
  //   }

  //   try {
  //     // Validate the token and get the payload.
  //     const payload = await verifyGoogleIDToken(tokenData.token);
  //     if (isUndefined(payload)) {
  //       return res.status(401).json({
  //         message: 'Token is not valid!',
  //         error: 'token_invalid',
  //       });
  //     }

  //     const user = await User.findOne({ provider: 'google', providerSub: payload.sub });

  //     if (!user) {
  //       return res.status(404).json({
  //         message: 'This account has not been registered yet',
  //         error: 'user_unregistered',
  //       });
  //     }

  //     // Issue a token
  //     const jwt = issueJWT(user);

  //     const loginResponse: AuthResponse = {
  //       message: 'Logged in successfully',
  //       user: user.toJSON(),
  //       jwt: jwt,
  //     }

  //     res.status(200).json(loginResponse);
      
  //   } catch (error) {
  //     // Check if it is a verification error
  //     if (error instanceof VerificationError) {
  //       return res.status(401).json({
  //         message: 'Token is not valid!',
  //         error: 'token_invalid',
  //       });
  //     }

  //     logger.log('error', `An error occured while logging in -> ${error}`);
      
  //     serverErrResponse(res);
  //   }

  // }; // Google Auth method

  logIn = async (req: Request, res: Response) => {
    // Grab json body content and check if it exists.
    const loginData: LoginData = req.body;
    if (isEmpty(loginData) || !loginData.email || !loginData.password) {
      return badRequestResponse(res, 'Login credentials is incomplete!');
    }

    try {
      // Check if the user exists.
      const user = await User.findOne({ email: loginData.email });

      if (!user) {
        return res.status(404).json({
          message: 'There are no accounts that exist with this email.',
          error: 'user_404'
        });
      }

      // Validate user password
      const validPassword = await user.isValidPassword(loginData.password);

      if (!validPassword) {
        return res.status(403).json({
          message: 'Incorrect password, check login credentials.',
          error: 'password_incorrect'
        });
      }

      // Issue a token
      const jwt = issueJWT(user);

      const loginResponse: AuthResponse = {
        message: 'Logged in successfully',
        user: user.toJSON(),
        jwt: jwt,
      }

      res.status(200).json(loginResponse);

    } catch (error) {
      logger.log('error', `An error occured while logging in -> ${error}`);
      
      serverErrResponse(res);
    }
  }; // Login

  signUp = async (req: Request, res: Response) => {
    // Grab json body content and check if it exists.
    const signUpData: SignUpData = req.body;
    if (isEmpty(signUpData)) {
      return badRequestResponse(res, 'Sign up data is incomplete!');
    }

  // Create a new user
    const user = new User({
      email: signUpData.email,
      fullName: signUpData.fullName,
      username: signUpData.username,
      password: signUpData.password,
    });

    // Perform model validations.
    const validationErr = user.validateSync();
    if (validationErr) {
      const fieldErrors = mapValues(validationErr.errors, 'message');

      // Validation error response.
      return res.status(400).json({
        message: 'Registration failed.',
        errors: fieldErrors
      });
    }

    // Try to save the user and send the data back to client.
    try {
      const newUser = await user.save();

      logger.log('info', `User created ${newUser}`);

      // Generate new token.
      const jwt = issueJWT(newUser);

      const authResponse: AuthResponse = {
        message: 'Signed up successfully.',
        user: newUser.toJSON(),
        jwt: jwt,
      }

      res.status(201).json(authResponse);

    } catch (error) {
      // Check if it's a duplicate validation error.
      if (error.name === 'ValidationError') {
        const errors = mapValues(error.errors, 'message');

        return res.status(403).json({
          message: 'A validation error occured.',
          errors: errors
        });
      }

      logger.log('error', `An error occured while saving -> ${error}`);

      serverErrResponse(res);
    }
  }; // Signup
}

export default AuthHandler;