import morgan from 'morgan';
import logger from '../utils/logger.js';
import type { Request, Response } from 'express';

// Create a stream that morgan can write to
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Skip successful requests (only log errors and non-2xx responses)
const skip = (req: Request, res: Response) => {
  return res.statusCode < 400;
};

// Custom Morgan format with more details
const morganMiddleware = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - Response Time: :response-time ms',
  { stream, skip },
);

export default morganMiddleware;
