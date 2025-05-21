import { z } from 'zod';
import { EmploymentType } from '@prisma/client';

const createExperienceZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    company: z.string({
      required_error: 'Company is required',
    }),
    location: z.string().optional(),
    type: z.enum(
      [
        EmploymentType.FULL_TIME,
        EmploymentType.PART_TIME,
        EmploymentType.CONTRACT,
        EmploymentType.INTERNSHIP,
        EmploymentType.FREELANCE,
      ],
      {
        required_error: 'Employment type is required',
      }
    ),
    startDate: z.string({
      required_error: 'Start date is required',
    }),
    endDate: z.string().optional(),
    isCurrent: z.boolean().default(false),
    description: z.array(z.string(), {
      required_error: 'Description is required',
    }),
  }),
});

const updateExperienceZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    type: z
      .enum([
        EmploymentType.FULL_TIME,
        EmploymentType.PART_TIME,
        EmploymentType.CONTRACT,
        EmploymentType.INTERNSHIP,
        EmploymentType.FREELANCE,
      ])
      .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
    description: z.array(z.string()).optional(),
  }),
});

export const ExperienceValidation = {
  createExperienceZodSchema,
  updateExperienceZodSchema,
};
