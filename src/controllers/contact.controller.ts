import { NextFunction, Request, Response } from 'express';
import { emailService } from '../services/email.service.js';
import { ApiSuccessResponse, ContactRequestBody } from '../types/contact.types.js';

export const handleContactForm = async (
  req: Request<Record<string, never>, ApiSuccessResponse, ContactRequestBody>,
  res: Response<ApiSuccessResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestId = req.id;
    await emailService.sendInquiryAndAutoReply(req.body, requestId);

    const response: ApiSuccessResponse = {
      success: true,
      message: 'Thank you. Your inquiry has been received.',
      requestId,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
