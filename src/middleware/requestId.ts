import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const existingId = req.header('x-request-id');
  const requestId = existingId || randomUUID();
  
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
};
