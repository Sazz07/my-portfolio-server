import { z } from 'zod';

const createContactZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    subject: z.string({
      required_error: 'Subject is required',
    }),
    message: z.string({
      required_error: 'Message is required',
    }),
  }),
});

const updateContactZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const ContactValidation = {
  createContactZodSchema,
  updateContactZodSchema,
};
