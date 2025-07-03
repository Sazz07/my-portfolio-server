import { z } from 'zod';

const updateProfileZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    resumeUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
  }),
});

export const UserValidation = {
  updateProfileZodSchema,
};
