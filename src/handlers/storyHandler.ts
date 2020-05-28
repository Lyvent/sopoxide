import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

import Story from '../models/Story';
import logger from '../middleware/logger';
import { serverErrResponse } from '../helpers/response';

const storyNotFound = (res: Response) => {
  res.status(404).json({
    message: 'Story not found.',
    error: 'story_404'
  });
}

const checkStoryID = (res: Response, storyID: string) => {
  if (!isValidObjectId(storyID)) {
    return res.status(400).json({
      message: 'Invalid Story ID!',
      error: 'id_invalid'
    });
  }
}

// Get a story
const getStory = async (req: Request, res: Response) => {
  // Get the story's ID.
  const storyID: string = req.params.storyID;
  checkStoryID(res, storyID);

  try {
    // Query the DB for the story
    const story = await Story.findById(storyID);
    
    if (!story) {
      return storyNotFound(res);
    }

    res.status(200).json({
      message: 'Story data sent.',
      story: story
    });

  } catch (error) {
    // Log and respond to the error.
    logger.log('error', `An error occured while fetching the story -> ${error}`);
    serverErrResponse(res);
  }
}

const updateStory = async (req: Request, res: Response) => {
  // Get the story's ID
  const storyID: string = req.params.storyID;
  checkStoryID(res, storyID);

  try {
    // Query the DB for the story
    const story = await Story.findById(storyID);
    if (!story) {
      return storyNotFound(res);
    }

    /* TODO:
      - Check if the current user is the story's author.
      - Update the story based on given req.body values.
    */
    
  } catch (error) {
    // Log and respond to the error.
    logger.log('error', `An error occured while fetching the story -> ${error}`);
    serverErrResponse(res);
  }
};

const deleteStory = async (req: Request, res: Response) => {
  // Get the story's ID
  const storyID: string = req.params.storyID;
  checkStoryID(res, storyID);

  try {
    // Query the DB for the story
    const story = await Story.findById(storyID);

    if (!story) {
      return storyNotFound(res);
    }

    // TODO: Implement author checking or admin role for deletion.

    res.status(501).json({
      message: 'This route hasn\'t been implemented yet.',
      data: req.user
    });
    
  } catch (error) {
    // Log and respond to the error.
    logger.log('error', `An error occured while fetching the story -> ${error}`);
    serverErrResponse(res);
  }
}

// Export Story CRUD.
export { getStory, updateStory, deleteStory }; 