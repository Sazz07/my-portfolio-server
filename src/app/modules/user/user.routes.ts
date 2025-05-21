import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { uploadSingle } from '../../middlewares/upload';

const router = express.Router();

router.get(
  '/profile',
  auth(UserRole.USER, UserRole.ADMIN),
  UserController.getProfile
);

router.patch(
  '/profile',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(UserValidation.updateProfileZodSchema),
  UserController.updateProfile
);

router.patch(
  '/profile/image',
  auth(UserRole.USER, UserRole.ADMIN),
  uploadSingle('file'),
  UserController.updateProfileImage
);

export const UserRoutes = router;
