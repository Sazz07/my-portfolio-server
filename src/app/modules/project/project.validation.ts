import { z } from 'zod';

const createProjectZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    features: z.array(z.string()).optional(),
    techStack: z
      .object({
        frontend: z.array(z.string()),
        backend: z.array(z.string()),
        devops: z.array(z.string()),
      })
      .optional(),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    categoryId: z.string({ required_error: 'Category is required' }),
  }),
});

const updateProjectZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    techStack: z
      .object({
        frontend: z.array(z.string()),
        backend: z.array(z.string()),
        devops: z.array(z.string()),
      })
      .optional(),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    status: z.enum(['ONGOING', 'COMPLETED']).optional(),
    imagesToRemove: z.string().optional(),
    featuredImage: z.string().optional(),
    categoryId: z.string().optional(),
  }),
});

export const ProjectValidation = {
  createProjectZodSchema,
  updateProjectZodSchema,
};
