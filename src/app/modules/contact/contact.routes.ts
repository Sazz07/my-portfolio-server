import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ContactValidation } from './contact.validation';
import { ContactController } from './contact.controller';

const router = express.Router();

// Public routes for submitting contact forms
router.post(
  '/profile/:profileId',
  validateRequest(ContactValidation.createContactZodSchema),
  ContactController.createContact
);

// Protected routes for managing contacts
router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  ContactController.getAllContacts
);

router.get(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  ContactController.getSingleContact
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(ContactValidation.updateContactZodSchema),
  ContactController.updateContact
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  ContactController.deleteContact
);

export const ContactRoutes = router;
