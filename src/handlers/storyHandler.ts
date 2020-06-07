import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { isEmpty, mapValues } from 'lodash';

import Story from '../models/Story';
import logger from '../middleware/logger';
import { badRequestResponse, serverErrResponse } from '../helpers/response';

// Interfaces
interface CreateData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

// Utils
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

class StoryHandler {
  get = async (req: Request, res: Response) => {
    // Get the story's ID
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
        story: story,
      });
      
    } catch (error) {
      // Log and respond to the error.
      logger.log('error', `An error occured while fetching the story -> ${error}`);
      serverErrResponse(res);
    }
  }; // Get Story

  create = async (req: Request, res: Response) => {
    // Grab json body content and check if it exists.
    const createData: CreateData = req.body;
    if (isEmpty(createData)) {
      badRequestResponse(res, 'Create data not found!');
      return;
    }

    /* TODO:
      - Check if the user has the privileges to create a post.
      - Story validations.
    */

    // Get current user data
    const currentUser: any = req.user;

    // Create a new story
    const story = new Story({
      title: createData.title,
      content: createData.content,
      author: currentUser._id,
      category: createData.category,
      tags: createData?.tags,
    });

    // Perform model validations
    const validationErr = story.validateSync();
    if (validationErr) {
      const fieldErrors = mapValues(validationErr.errors, 'message');

      // Validation error response.
      return res.status(400).json({
        message: 'Story creation failed.',
        errors: fieldErrors,
      });
    }

    // Try to save the story and send the data back to client.
    try {
      let newStory = await story.save();

      // Populate new story with author and assign it newStory.
      newStory = await Story.populate(newStory, { path: 'author' });

      logger.log('info', `${currentUser.username} created a new story.`);

      res.status(201).json({
        message: 'Created a new story.',
        story: newStory,
      });

    } catch (error) {
      // Log and respond to the error.
      logger.log('error', `An error occured while fetching the story -> ${error}`);
      serverErrResponse(res); 
    }
  }; // Create Story

  update = async (req: Request, res: Response) => {
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
  }; // Update Story

  delete = async (req: Request, res: Response) => {
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
  }; // Delete Story
}

export default StoryHandler;