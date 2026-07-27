import { env } from './env.js';

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromName: string;
  adminEmail: string;
}

export const mailConfig: MailConfig = {
  host: 'smtp.gmail.com',
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  fromName: 'Abdul Hanan Portfolio',
  adminEmail: env.EMAIL_USER,
};
