import { z } from 'zod';

const createContactZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(5, 'Message must be at least 5 characters'),
  }),
});

export const ContactValidation = {
  createContactZodSchema,
};
