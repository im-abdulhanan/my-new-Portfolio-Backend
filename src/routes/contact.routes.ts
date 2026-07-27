import { Router } from 'express';
import { handleContactForm } from '../controllers/contact.controller.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { contactSchema } from '../schemas/contact.schema.js';

const contactRouter = Router();

contactRouter.post('/', contactLimiter, validate(contactSchema), handleContactForm);

export { contactRouter };
