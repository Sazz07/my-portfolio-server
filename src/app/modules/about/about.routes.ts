import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { AboutValidation } from './about.validation';
import { AboutController } from './about.controller';

const router = express.Router();

// Public routes
router.get('/profile/:profileId', AboutController.getAboutByProfile);

// Protected routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AboutValidation.createAboutZodSchema),
  AboutController.createOrUpdateAbout
);

router.patch(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AboutValidation.updateAboutZodSchema),
  AboutController.updateAbout
);

export const AboutRoutes = router;
