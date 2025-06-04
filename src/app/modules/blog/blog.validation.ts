import { z } from 'zod';
import { BlogStatus } from '@prisma/client';

type BlogSchema = z.ZodObject<any>;
type BlogCategorySchema = z.ZodObject<any>;

const createBlogZodSchema: BlogSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    summary: z.string().optional(),
    content: z
      .string({
        required_error: 'Content is required',
      })
      .refine(
        (value) => {
          const textContent = value.replace(/<[^>]*>/g, '').trim();
          return textContent.length > 0;
        },
        {
          message: 'Content must contain some text',
        }
      ),
    status: z
      .enum([BlogStatus.DRAFT, BlogStatus.PUBLISHED, BlogStatus.ARCHIVED])
      .optional(),
    tags: z.array(z.string()).optional(),
    categoryId: z.string({
      required_error: 'Category ID is required',
    }),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const updateBlogZodSchema: BlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    content: z
      .string()
      .refine(
        (value) => {
          if (!value) return true; // Allow empty string for optional updates
          const textContent = value.replace(/<[^>]*>/g, '').trim();
          return textContent.length > 0;
        },
        {
          message: 'Content must contain some text',
        }
      )
      .optional(),
    status: z
      .enum([BlogStatus.DRAFT, BlogStatus.PUBLISHED, BlogStatus.ARCHIVED])
      .optional(),
    tags: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    imagesToRemove: z.string().optional(),
  }),
});

const createBlogCategoryZodSchema: BlogCategorySchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    description: z.string().optional(),
  }),
});

const updateBlogCategoryZodSchema: BlogCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const BlogValidation = {
  createBlogZodSchema,
  updateBlogZodSchema,
  createBlogCategoryZodSchema,
  updateBlogCategoryZodSchema,
} as const;
