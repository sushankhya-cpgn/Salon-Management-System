import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

// Middleware to log all requests
export const requestLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();

  // Log request details
  logger.http(
    `Incoming Request: ${req.method} ${req.path} | IP: ${req.ip} | User: ${req?.user || 'Anonymous'}`,
  );

  // Log request body (for POST/PATCH requests)
  if (req.body && Object.keys(req.body).length > 0) {
    logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
  }

  // Override res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    const duration = Date.now() - startTime;
    logger.http(
      `Response: ${req.method} ${req.path} | Status: ${res.statusCode} | Duration: ${duration}ms`,
    );

    if (res.statusCode >= 400) {
      logger.warn(`Error Response: ${JSON.stringify(data)}`);
    }

    return originalJson(data);
  };

  next();
};

// Error logging middleware
export const errorLoggingMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(
    `Error: ${err.message} | Method: ${req.method} | Path: ${req.path} | Stack: ${err.stack}`,
  );

  next(err);
};
