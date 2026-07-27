import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z
    .string({ required_error: 'CLIENT_URL is required' })
    .min(1, 'CLIENT_URL cannot be empty')
    .transform((url) => url.replace(/\/+$/, '')),
  EMAIL_USER: z
    .string({ required_error: 'EMAIL_USER is required' })
    .email('EMAIL_USER must be a valid email address'),
  EMAIL_PASS: z
    .string({ required_error: 'EMAIL_PASS is required' })
    .min(1, 'EMAIL_PASS cannot be empty'),
  EMAIL_PORT: z
    .string()
    .default('465')
    .transform((val) => parseInt(val, 10)),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('\n❌ Invalid environment variables configuration:');
    const fieldErrors = result.error.flatten().fieldErrors;
    for (const [field, errors] of Object.entries(fieldErrors)) {
      console.error(`  - ${field}: ${errors?.join(', ')}`);
    }
    console.error('\n👉 Make sure your .env file exists and contains valid credentials.\n');
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
