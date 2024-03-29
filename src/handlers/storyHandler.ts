import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { isEmpty, mapValues } from 'lodash';

import Story, { allowedChanges } from '../models/Story';
import logger from '../middleware/logger';
import { badRequestResponse, serverErrResponse } from '../helpers/response';

// Interfaces
interface CreateData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

interface UpdateData {
  title?: string;
  content?: string;
  category?: string;
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
        story: story.toJSON(),
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
      return badRequestResponse(res, 'Create data not found!');
    }

    // Get current user data passed into context by JWT.
    const currentUser: any = req.user;

    // Check if the user has confirmed their account.
    if (!currentUser.confirmed) {
      return res.status(403).json({
        message: 'You are not eligible to create posts.',
        error: 'user_unauthorized'
      });
    }

    // Create the story and send the data back to client.
    try {
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

      let newStory = await story.save();

      // Populate new story with author and assign it newStory.
      newStory = await Story.populate(newStory, { path: 'author' });

      logger.log('info', `${currentUser.username} created a new story.`);

      res.status(201).json({
        message: 'Created a new story.',
        story: newStory.toJSON(),
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
    const updateData: UpdateData = req.body;

    checkStoryID(res, storyID);

    // Get current user in req context.
    const currentUser: any = req.user;

    try {
      // Query the DB for the story
      const story = await Story.findById(storyID);

      if (!story) {
        return storyNotFound(res);
      }

      if (currentUser._id !== story.author) {
        return res.status(403).json({
          message: 'This story does not belong to the user.',
          error: 'user_unauthorized'
        });
      }

      for (const [key, value] of Object.entries(updateData)) {
        // Check if key is allowed.
        if (allowedChanges.includes(key)) {
          // Update the story.
          story[key] = value;
        }
      }

      // Validate changes
      const validationErr = story.validateSync();

      if (validationErr) {
        const fieldErrors = mapValues(validationErr.errors, 'message');

        // Validation error response.
        return res.status(400).json({
          message: 'Update validations failed.',
          errors: fieldErrors,
        });
      }

      // Save changes and log event.
      await story.save();
      logger.log('info', `User <${ currentUser._id }> updated a Story <${ story._id }>`)

      res.status(200).json({
        message: 'Story has been updated.',
      });

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

    // Get current user in req context.
    const currentUser: any = req.user;

    try {
      // Query the DB for the story
      const story = await Story.findById(storyID);

      if (!story) {
        return storyNotFound(res);
      }

      // Check if user may not be the author or isn't an admin.
      if (currentUser._id !== story.author || currentUser.role !== 'admin') {
        return res.status(403).json({
          message: 'This story does not belong to the user.',
          error: 'user_unauthorized'
        });
      }

      // Delete the story and log the event.
      await Story.deleteOne({ _id: storyID });

      logger.log('info', `User <${ currentUser._id }> deleted a Story <${ story._id }>`);

      res.status(200).json({
        message: `Story <${ story._id }> has successfully been deleted`,
      });
      
    } catch (error) {
      // Log and respond to the error.
      logger.log('error', `An error occured while fetching the story -> ${error}`);
      serverErrResponse(res);
    }
  }; // Delete Story
}

export default StoryHandler;
export { CreateData, UpdateData };