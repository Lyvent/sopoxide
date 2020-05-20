import { Request, Response } from 'express';
import { issueJWT } from '../middleware/auth';
import { isEmpty, mapValues } from 'lodash';
import logger from '../middleware/logger';
import User from '../models/User';

// interface LoginData {
//   email: string;
//   password: string;
// }

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

const signUp = async (req: Request, res: Response) => {
  // Grab body json content and check if it exists.
  const signUpData: SignUpData = req.body;
  if (isEmpty(signUpData)) {
    return res.status(400).json({
      message: 'Sign up data not found!',
      error: 'data_404',
    });
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

    res.status(500).json({
      error: 'server_error',
      message: 'An error occured',
    });
  }
};

export { signUp };