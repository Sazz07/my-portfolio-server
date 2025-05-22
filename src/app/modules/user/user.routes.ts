import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { createFileUploadMiddleware } from '../../middlewares/fileUploadMiddleware';

const router = express.Router();

router.get(
  '/profile',
  auth(UserRole.USER, UserRole.ADMIN),
  UserController.getProfile
);

router.patch(
  '/profile',
  auth(UserRole.USER, UserRole.ADMIN),
  createFileUploadMiddleware({
    fieldName: 'image',
    maxCount: 1,
    parseData: true,
    validationSchema: UserValidation.updateProfileZodSchema,
  }),
  UserController.updateProfile
);

export const UserRoutes = router;
