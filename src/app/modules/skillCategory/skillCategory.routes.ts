import express from 'express';
import { SkillCategoryController } from './skillCategory.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Public routes
router.get('/', SkillCategoryController.getAllSkillCategories);
router.get('/:id', SkillCategoryController.getSingleSkillCategory);

// Protected routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  SkillCategoryController.createSkillCategory
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  SkillCategoryController.updateSkillCategory
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  SkillCategoryController.deleteSkillCategory
);

export const SkillCategoryRoutes = router;
