import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { SkillValidation } from './skill.validation';
import { SkillController } from './skill.controller';

const router = express.Router();

// Public routes
router.get('/', SkillController.getAllSkills);
router.get('/:id', SkillController.getSingleSkill);
router.get('/profile/:profileId', SkillController.getSkillsByProfile);

// Protected routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(SkillValidation.createSkillZodSchema),
  SkillController.createSkill
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(SkillValidation.updateSkillZodSchema),
  SkillController.updateSkill
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  SkillController.deleteSkill
);

export const SkillRoutes = router;
