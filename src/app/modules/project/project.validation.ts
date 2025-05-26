import { z } from 'zod';

const createProjectZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    technologies: z.array(z.string()).optional(),
  }),
});

const updateProjectZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    technologies: z.array(z.string()).optional(),
    status: z.enum(['ONGOING', 'COMPLETED']).optional(),
    imagesToRemove: z.string().optional(),
  }),
});

export const ProjectValidation = {
  createProjectZodSchema,
  updateProjectZodSchema,
};
