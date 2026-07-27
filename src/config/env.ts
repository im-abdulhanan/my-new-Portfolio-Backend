import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../lib/logger.js';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().min(1, 'CLIENT_URL is required'),
  EMAIL_USER: z.string().email('EMAIL_USER must be a valid email'),
  EMAIL_PASS: z.string().min(1, 'EMAIL_PASS is required'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    logger.error({ errors: result.error.format() }, '❌ Invalid environment variables configuration:');
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
