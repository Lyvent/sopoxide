import { Request, Response } from 'express';
import { PaginateOptions } from 'mongoose';
import Story from '../models/Story';

class FeedHandler {
  stories = async (req: Request, res: Response) => {

    const options: PaginateOptions = {
      page: parseInt((req.query as any).page),
      populate: 'author',
      limit: 15 // Limit to 15 stories per feed.
    }

    const results = await Story.paginate({}, options);

    const pageData = {
      currentPage: options.page,
      nextPage: results.nextPage,
      prevPage: results.prevPage,
      totalPages: results.totalPages,

      hasNextPage: results.hasNextPage,
      hasPrevPage: results.hasPrevPage
    }

    if (!results) {
      return res.status(500).json({
        message: 'Feed error occured.',
      });
    }

    res.status(200).json({
      message: 'Stories sent.',
      stories: results.docs,
      pageData: pageData
    });
  } // Get stories
  // @TODO: Implement feed features.
}

export default FeedHandler;