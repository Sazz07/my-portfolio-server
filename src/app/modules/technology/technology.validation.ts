import { z } from 'zod';

const createTechnologyZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    value: z.string({
      required_error: 'Value is required',
    }),
  }),
});

const updateTechnologyZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    value: z.string().optional(),
  }),
});

export const TechnologyValidation = {
  createTechnologyZodSchema,
  updateTechnologyZodSchema,
};
