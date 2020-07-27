import { Request, Response } from 'express';

import User from '../models/User';
import logger from '../middleware/logger';

import { serverErrResponse } from '../helpers/response';

interface GetResponse {
  message: string;
  user: JSON;
}

class UserHandler {
  // Get a specific user using their username
  get = async (req: Request, res: Response) => {
    const username = req.params?.username;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({
          message: 'There are no user associated with this username',
          error: 'user_404'
        });
      }

      const getResponse: GetResponse = {
        message: `${username} data sent.`,
        user: user.toJSON()
      };

      res.status(200).json(getResponse);

    } catch (error) {
      logger.log('error', `An error occured while getting '${username}' data -> ${error}`)      

      serverErrResponse(res);
    }
  }; // Get specific user
}

export default UserHandler;