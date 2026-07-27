import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../lib/logger.js';
import { ApiErrorResponse } from '../types/contact.types.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const requestId = req.id || 'N/A';
  const timestamp = new Date().toISOString();

  // Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    err.errors.forEach((issue) => {
      const field = issue.path.join('.') || 'body';
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(issue.message);
    });

    const response: ApiErrorResponse = {
      success: false,
      message: 'Validation failed. Please check your inputs.',
      requestId,
      timestamp,
      errors: formattedErrors,
    };

    res.status(400).json(response);
    return;
  }

  // Log unhandled operational / internal errors
  logger.error(
    {
      requestId,
      errorName: err.name,
      errorMessage: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    `Error processing request ${req.method} ${req.url}`,
  );

  const response: ApiErrorResponse = {
    success: false,
    message: 'Unable to process project inquiry. Please try again later.',
    requestId,
    timestamp,
  };

  res.status(500).json(response);
};
