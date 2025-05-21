import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ExperienceValidation } from './experience.validation';
import { ExperienceController } from './experience.controller';

const router = express.Router();

// Public routes
router.get('/', ExperienceController.getAllExperiences);
router.get('/:id', ExperienceController.getSingleExperience);
router.get('/profile/:profileId', ExperienceController.getExperiencesByProfile);

// Protected routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(ExperienceValidation.createExperienceZodSchema),
  ExperienceController.createExperience
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(ExperienceValidation.updateExperienceZodSchema),
  ExperienceController.updateExperience
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  ExperienceController.deleteExperience
);

export const ExperienceRoutes = router;
