import { z } from 'zod';

export const contactSchema = z
  .object({
    fullName: z
      .string({ required_error: 'Full Name is required' })
      .trim()
      .min(2, 'Full Name must be at least 2 characters')
      .max(60, 'Full Name must not exceed 60 characters'),
    email: z
      .string({ required_error: 'Email address is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address')
      .max(255, 'Email address must not exceed 255 characters'),
    company: z
      .string()
      .trim()
      .max(100, 'Company name must not exceed 100 characters')
      .optional(),
    projectType: z
      .string({ required_error: 'Project Type is required' })
      .trim()
      .min(2, 'Project Type must be at least 2 characters')
      .max(50, 'Project Type must not exceed 50 characters'),
    budget: z
      .string()
      .trim()
      .max(50, 'Budget must not exceed 50 characters')
      .optional(),
    timeline: z
      .string()
      .trim()
      .max(50, 'Timeline must not exceed 50 characters')
      .optional(),
    projectDetails: z
      .string()
      .trim()
      .max(2000, 'Project Details must not exceed 2000 characters')
      .optional(),
    details: z
      .string()
      .trim()
      .max(2000, 'Project Details must not exceed 2000 characters')
      .optional(),
    website: z
      .string()
      .optional()
      .refine((val) => !val || val.length === 0, {
        message: 'Spam submission detected',
      }),
    loadedAt: z
      .number({ invalid_type_error: 'loadedAt must be a numeric timestamp' })
      .optional()
      .refine(
        (val) => {
          if (val === undefined) return true;
          const now = Date.now();
          const elapsed = now - val;
          return elapsed >= 3000 && elapsed < 86400000;
        },
        {
          message: 'Form submitted too quickly. Please try again.',
        },
      ),
  })
  .transform((data) => {
    const finalDetails = data.projectDetails || data.details || '';
    return {
      ...data,
      projectDetails: finalDetails,
      details: finalDetails,
    };
  })
  .refine((data) => data.projectDetails.length >= 10, {
    message: 'Project Details must be at least 10 characters',
    path: ['projectDetails'],
  });

export type ContactSchemaType = z.infer<typeof contactSchema>;
