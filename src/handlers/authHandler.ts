import { Request, Response } from 'express';
import { issueJWT } from '../middleware/auth';
import { isEmpty, mapValues } from 'lodash';
import logger from '../middleware/logger';
import User from '../models/User';

import { badRequestResponse, serverErrResponse } from '../helpers/response';

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

const logIn = async (req: Request, res: Response) => {
  // Grab json body content and check if it exists.
  const loginData: LoginData = req.body;
  if (isEmpty(loginData)) {
    badRequestResponse(res, 'Login data not found!');
    return;
  }

  // Check if the user exists.
  // TODO: Implement user querying.
  const user = await User.findOne();

  if (!user) {
    return res.status(404).json({
      message: 'There are no accounts that exist with this email.',
      error: 'user_404'
    });
  }
};

const signUp = async (req: Request, res: Response) => {
  // Grab json body content and check if it exists.
  const signUpData: SignUpData = req.body;
  if (isEmpty(signUpData)) {
    badRequestResponse(res, 'Sign up data not found!');
    return;
  }

 // Create a new user
  // TODO: Add validation error handler.
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

    // Filter sensitive user information.

    const jwt = issueJWT(newUser);

    res.status(201).json({
      message: 'Signed up successfully.',
      user: newUser,
      jwt: jwt,
    });

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
};

export { logIn, signUp };