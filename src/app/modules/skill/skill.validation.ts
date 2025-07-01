import { z } from 'zod';

const createSkillZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    proficiency: z
      .number({
        required_error: 'Proficiency is required',
      })
      .min(0)
      .max(100),
    categoryId: z.string({
      required_error: 'Category is required',
    }),
  }),
});

const updateSkillZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    proficiency: z.number().min(0).max(100).optional(),
    categoryId: z.string().optional(),
  }),
});

export const SkillValidation = {
  createSkillZodSchema,
  updateSkillZodSchema,
};
