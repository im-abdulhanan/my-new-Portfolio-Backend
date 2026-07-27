import { Router } from 'express';
import { handleHealthCheck } from '../controllers/health.controller.js';

const healthRouter = Router();

healthRouter.get('/', handleHealthCheck);

export { healthRouter };
