import { z } from 'zod';

const createAboutZodSchema = z.object({
  body: z.object({
    journey: z.string({ required_error: 'Journey is required' }),
    values: z.string({ required_error: 'Values are required' }),
    approach: z.string({ required_error: 'Approach is required' }),
    beyondCoding: z.string({ required_error: 'Beyond coding is required' }),
    lookingForward: z.string({ required_error: 'Looking forward is required' }),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    image: z.string().optional(),
  }),
});

const updateAboutZodSchema = z.object({
  body: z.object({
    journey: z.string().optional(),
    values: z.string().optional(),
    approach: z.string().optional(),
    beyondCoding: z.string().optional(),
    lookingForward: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    image: z.string().optional(),
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
