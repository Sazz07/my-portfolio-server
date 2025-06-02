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
    image: z.string().optional(),
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
    image: z.string().optional(), // Added field for image URL
  }),
});

// Quote validation schemas
const createQuoteZodSchema = z.object({
  body: z.object({
    text: z.string({
      required_error: 'Quote text is required',
    }),
    author: z.string({
      required_error: 'Author is required',
    }),
    source: z.string().optional(),
  }),
});

const updateQuoteZodSchema = z.object({
  body: z.object({
    text: z.string().optional(),
    author: z.string().optional(),
    source: z.string().optional(),
  }),
});

export const AboutValidation = {
  createAboutZodSchema,
  updateAboutZodSchema,
  createQuoteZodSchema,
  updateQuoteZodSchema,
};
