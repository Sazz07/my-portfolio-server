import { z } from 'zod';

const createEducationZodSchema = z.object({
  body: z.object({
    institution: z.string({
      required_error: 'Institution is required',
    }),
    degree: z.string({
      required_error: 'Degree is required',
    }),
    fieldOfStudy: z.string({
      required_error: 'Field of study is required',
    }),
    location: z.string().optional(),
    startDate: z.string({
      required_error: 'Start date is required',
    }),
    endDate: z.string().optional(),
    isCurrent: z.boolean().default(false),
    grade: z.string().optional(),
    activities: z.string().optional(),
    description: z.array(z.string()).optional(),
  }),
});

const updateEducationZodSchema = z.object({
  body: z.object({
    institution: z.string().optional(),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
    grade: z.string().optional(),
    activities: z.string().optional(),
    description: z.array(z.string()).optional(),
  }),
});

export const EducationValidation = {
  createEducationZodSchema,
  updateEducationZodSchema,
};
