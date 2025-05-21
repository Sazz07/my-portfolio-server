import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerZodSchema),
  AuthController.registerUser
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

router.patch(
  '/change-password',
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
);

router.post('/logout', AuthController.logoutUser);

export const AuthRoutes = router;
