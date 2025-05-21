import { z } from 'zod';

const createAboutZodSchema = z.object({
  body: z.object({
    introduction: z.string({
      required_error: 'Introduction is required',
    }),
    overview: z.string({
      required_error: 'Overview is required',
    }),
    servicesOffered: z.array(z.string(), {
      required_error: 'Services offered are required',
    }),
    toolsAndTech: z.array(z.string(), {
      required_error: 'Tools and technologies are required',
    }),
    achievements: z.array(z.string(), {
      required_error: 'Achievements are required',
    }),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const updateAboutZodSchema = z.object({
  body: z.object({
    introduction: z.string().optional(),
    overview: z.string().optional(),
    servicesOffered: z.array(z.string()).optional(),
    toolsAndTech: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const AboutValidation = {
  createAboutZodSchema,
  updateAboutZodSchema,
};
