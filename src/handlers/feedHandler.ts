import { Request, Response } from 'express';
import { PaginateOptions } from 'mongoose';

import { serverErrResponse } from '../helpers/response';
import Story from '../models/Story';
import logger from '../middleware/logger';

class FeedHandler {
  stories = async (req: Request, res: Response) => {

    const options: PaginateOptions = {
      page: parseInt((req.query as any).page),
      populate: 'author',
      limit: 15, // Limit to 15 stories per feed.
      sort: {
        // Sort from newest to oldest.
        'createdAt': -1
      }
    };

    try {
      const results = await Story.paginate({}, options);

      const pageData = {
        currentPage: options.page,
        nextPage: results.nextPage,
        prevPage: results.prevPage,
        totalPages: results.totalPages,

        hasNextPage: results.hasNextPage,
        hasPrevPage: results.hasPrevPage
      }

      res.status(200).json({
        message: 'Stories sent.',
        stories: results.docs,
        pageData: pageData
      });

    } catch (error) {
      // Log and respond to the error.
      logger.log('error', `An error occured while fetching paginated posts -> ${error}`);
      serverErrResponse(res);
    }
  } // Get stories
}

export default FeedHandler;