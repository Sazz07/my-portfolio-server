import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ProjectValidation } from './project.validation';
import { ProjectController } from './project.controller';
import { uploadMultiple, uploadSingle } from '../../middlewares/upload';

const router = express.Router();

// Public routes
router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getSingleProject);

// Protected routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  uploadSingle('image'),
  validateRequest(ProjectValidation.createProjectZodSchema),
  ProjectController.createProject
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  uploadSingle('image'),
  validateRequest(ProjectValidation.updateProjectZodSchema),
  ProjectController.updateProject
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  ProjectController.deleteProject
);

export const ProjectRoutes = router;
