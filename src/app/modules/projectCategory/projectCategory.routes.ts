import express from 'express';
import { ProjectCategoryController } from './projectCategory.controller';

const router = express.Router();

router.post('/', ProjectCategoryController.createCategory);
router.get('/', ProjectCategoryController.getAllCategories);
router.get('/:id', ProjectCategoryController.getSingleCategory);

export const ProjectCategoryRoutes = router;
