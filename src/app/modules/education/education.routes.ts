import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { EducationValidation } from './education.validation';
import { EducationController } from './education.controller';

const router = express.Router();

// Public routes
router.get('/', EducationController.getAllEducation);
router.get('/:id', EducationController.getSingleEducation);
router.get('/profile/:profileId', EducationController.getEducationByProfile);

// Protected routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(EducationValidation.createEducationZodSchema),
  EducationController.createEducation
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(EducationValidation.updateEducationZodSchema),
  EducationController.updateEducation
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  EducationController.deleteEducation
);

export const EducationRoutes = router;
