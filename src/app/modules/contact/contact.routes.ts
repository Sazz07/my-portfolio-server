import express from 'express';
import { ContactController } from './contact.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ContactValidation } from './contact.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Public route for submitting contact form
router.post(
  '/',
  validateRequest(ContactValidation.createContactZodSchema),
  ContactController.createContact
);

// Protected route for admin to get all contacts
router.get('/', auth(UserRole.ADMIN), ContactController.getAllContacts);

router.delete('/:id', auth(UserRole.ADMIN), ContactController.deleteContact);

export const ContactRoutes = router;
