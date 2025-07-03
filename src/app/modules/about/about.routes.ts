import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { AboutValidation } from './about.validation';
import { AboutController } from './about.controller';
import { createFileUploadMiddleware } from '../../middlewares/fileUploadMiddleware';

const router = express.Router();

// Public routes
router.get('/profile/:profileId', AboutController.getAboutByProfile);
router.get('/profile/:profileId/quote/random', AboutController.getRandomQuote);

// Protected routes for About
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  createFileUploadMiddleware({
    fieldName: 'image',
    maxCount: 1,
    parseData: true,
    validationSchema: AboutValidation.createAboutZodSchema,
  }),
  AboutController.createOrUpdateAbout
);

router.patch(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  createFileUploadMiddleware({
    fieldName: 'image',
    maxCount: 1,
    parseData: true,
    validationSchema: AboutValidation.updateAboutZodSchema,
  }),
  AboutController.updateAbout
);

// Protected routes for Quotes
router.post(
  '/quotes',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AboutValidation.createQuoteZodSchema),
  AboutController.createQuote
);

router.get(
  '/quotes',
  auth(UserRole.USER, UserRole.ADMIN),
  AboutController.getAllQuotes
);

router.patch(
  '/quotes/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AboutValidation.updateQuoteZodSchema),
  AboutController.updateQuote
);

router.delete(
  '/quotes/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  AboutController.deleteQuote
);

router.get(
  '/me',
  auth(UserRole.USER, UserRole.ADMIN),
  AboutController.getAboutMe
);

export const AboutRoutes = router;
