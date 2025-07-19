import express from 'express';
import { TechnologyController } from './technology.controller';

const router = express.Router();

router.post('/', TechnologyController.createTechnology);
router.get('/', TechnologyController.getAllTechnologies);
router.get('/categories', TechnologyController.getAllTechnologyCategories);
router.get(
  '/category/:category',
  TechnologyController.getTechnologiesByCategory
);
router.post('/seed', TechnologyController.seedTechnologies);

export const TechnologyRoutes = router;
