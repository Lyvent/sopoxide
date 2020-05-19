import { Request, Response } from 'express';
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

// interface ResponseData {
//   token: string;
//   message: string;
//   user: UserDoc;
// }

const signUp = async (req: Request, res: Response) => {
  // Grab body json content.
  const signUpData: SignUpData = req.body;

 // Create a new user
  // TODO: Add validation error handler.
  const user = new User({
    email: signUpData.email,
    fullName: signUpData.fullName,
  });

  // Perform validations
  const error = user.validateSync();
  if (error) {
    return res.status(400).json({
      message: 'Registration failed.',
      error: error.errors
    });
  }

  // Filter sensitive user information.
  const newUser = await user.save(function(err) {
    // Handle save error.
    if (err) {
      console.error(err);

      return res.status(500).json({
        error: 'server_error',
        message: 'An error occured!'
      });
    }
  });

  // Generate access token

  res.status(201).json({
    message: 'Signed up successfully.',
    user: newUser
  })
};

export { signUp };