import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { ProjectValidation } from './project.validation';
import { ProjectController } from './project.controller';
import { createFileUploadMiddleware } from '../../middlewares/fileUploadMiddleware';

const router = express.Router();

// Public routes
router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getSingleProject);

// Protected routes
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  createFileUploadMiddleware({
    fieldName: 'images',
    maxCount: 5,
    parseData: true,
    validationSchema: ProjectValidation.createProjectZodSchema,
  }),
  ProjectController.createProject
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  createFileUploadMiddleware({
    fieldName: 'images',
    maxCount: 5,
    parseData: true,
    validationSchema: ProjectValidation.updateProjectZodSchema,
  }),
  ProjectController.updateProject
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  ProjectController.deleteProject
);

export const ProjectRoutes = router;
