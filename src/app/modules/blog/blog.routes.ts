import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './blog.validation';
import { BlogController } from './blog.controller';
import { createFileUploadMiddleware } from '../../middlewares/fileUploadMiddleware';

const router = express.Router();

// Blog Category Routes
router.post(
  '/categories',
  auth(UserRole.ADMIN),
  validateRequest(BlogValidation.createBlogCategoryZodSchema),
  BlogController.createCategory
);

router.get('/categories', BlogController.getAllCategories);

router.get('/categories/:idOrSlug', BlogController.getSingleCategory);

router.patch(
  '/categories/:idOrSlug',
  auth(UserRole.ADMIN),
  validateRequest(BlogValidation.updateBlogCategoryZodSchema),
  BlogController.updateCategory
);

router.delete(
  '/categories/:idOrSlug',
  auth(UserRole.ADMIN),
  BlogController.deleteCategory
);

// Blog Routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  createFileUploadMiddleware({
    fieldName: 'images',
    maxCount: 5,
    parseData: true,
    validationSchema: BlogValidation.createBlogZodSchema,
  }),
  BlogController.createBlog
);

router.get('/', BlogController.getAllBlogs);

router.get(
  '/my-blogs',
  auth(UserRole.USER, UserRole.ADMIN),
  BlogController.getUserBlogs
);

router.get('/:idOrSlug', BlogController.getSingleBlog);

router.patch(
  '/:idOrSlug',
  auth(UserRole.USER, UserRole.ADMIN),
  createFileUploadMiddleware({
    fieldName: 'images',
    maxCount: 5,
    parseData: true,
    validationSchema: BlogValidation.updateBlogZodSchema,
  }),
  BlogController.updateBlog
);

router.delete(
  '/:idOrSlug',
  auth(UserRole.USER, UserRole.ADMIN),
  BlogController.deleteBlog
);

export const BlogRoutes = router;
