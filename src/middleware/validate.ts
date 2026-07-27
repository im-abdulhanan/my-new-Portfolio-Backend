import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedBody = await schema.parseAsync(req.body);
      req.body = parsedBody;
      next();
    } catch (error) {
      next(error);
    }
  };
};
