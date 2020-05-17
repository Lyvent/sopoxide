import { Router, Request, Response } from 'express';

const Story = require('../models/Story');

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200);
  res.send('Henlo friend.');
});

module.exports = router;
