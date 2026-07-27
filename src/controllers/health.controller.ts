import { Request, Response } from 'express';
import { env } from '../config/env.js';
import { HealthResponse } from '../types/contact.types.js';

export const handleHealthCheck = (
  _req: Request,
  res: Response<HealthResponse>,
): void => {
  const healthData: HealthResponse = {
    status: 'ok',
    version: '1.0.0',
    uptime: Math.round(process.uptime() * 100) / 100,
    nodeVersion: process.version,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(healthData);
};
