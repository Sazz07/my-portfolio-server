import express from 'express';
import { TechnologyController } from './technology.controller';
import { TechnologyValidation } from './technology.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Public routes
router.get('/', TechnologyController.getAllTechnologies);
router.get('/:id', TechnologyController.getSingleTechnology);

// Protected routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(TechnologyValidation.createTechnologyZodSchema),
  TechnologyController.createTechnology
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(TechnologyValidation.updateTechnologyZodSchema),
  TechnologyController.updateTechnology
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  TechnologyController.deleteTechnology
);

export const TechnologyRoutes = router;
