import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { ProjectRoutes } from '../modules/project/project.routes';
import { ExperienceRoutes } from '../modules/experience/experience.routes';
import { EducationRoutes } from '../modules/education/education.routes';
import { BlogRoutes } from '../modules/blog/blog.routes';
import { AboutRoutes } from '../modules/about/about.routes';
import { SkillRoutes } from '../modules/skill/skill.routes';
import { ContactRoutes } from '../modules/contact/contact.routes';
import { TechnologyRoutes } from '../modules/technology/technology.routes';
import { SkillCategoryRoutes } from '../modules/skillCategory/skillCategory.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },

  {
    path: '/projects',
    route: ProjectRoutes,
  },
  {
    path: '/skills',
    route: SkillRoutes,
  },
  {
    path: '/contacts',
    route: ContactRoutes,
  },
  {
    path: '/experiences',
    route: ExperienceRoutes,
  },
  {
    path: '/educations',
    route: EducationRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/about',
    route: AboutRoutes,
  },
  {
    path: '/technologies',
    route: TechnologyRoutes,
  },
  {
    path: '/skill-categories',
    route: SkillCategoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
