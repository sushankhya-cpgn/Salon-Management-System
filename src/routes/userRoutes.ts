import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

router.get('/users', (req: Request, res: Response) => {
  res.status(200).json({ message: 'List of users' });
});

export default router;