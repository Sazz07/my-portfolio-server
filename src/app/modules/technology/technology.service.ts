import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Technology, TechnologyCategory } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ICreateTechnology, IUpdateTechnology } from './technology.interface';

const createTechnology = async (payload: {
  name: string;
  categoryId: string;
}): Promise<Technology> => {
  const existingTech = await prisma.technology.findFirst({
    where: {
      OR: [
        { name: payload.name },
        { value: payload.name.toLowerCase().replace(/\s+/g, '-') },
      ],
    },
  });

  if (existingTech) {
    return existingTech;
  }

  const result = await prisma.technology.create({
    data: {
      name: payload.name,
      value: payload.name.toLowerCase().replace(/\s+/g, '-'),
      categoryId: payload.categoryId,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const getAllTechnologies = async () => {
  const result = await prisma.technology.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return result;
};

const getTechnologiesByCategory = async (categoryValue: string) => {
  const result = await prisma.technology.findMany({
    where: {
      category: {
        value: categoryValue,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return result;
};

const getAllTechnologyCategories = async () => {
  const result = await prisma.technologyCategory.findMany({
    include: {
      technologies: {
        orderBy: {
          name: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return result;
};

const seedTechnologies = async () => {
  // Create technology categories
  const frontendCategory = await prisma.technologyCategory.upsert({
    where: { value: 'frontend' },
    update: {},
    create: {
      name: 'Frontend',
      value: 'frontend',
    },
  });

  const backendCategory = await prisma.technologyCategory.upsert({
    where: { value: 'backend' },
    update: {},
    create: {
      name: 'Backend',
      value: 'backend',
    },
  });

  const devopsCategory = await prisma.technologyCategory.upsert({
    where: { value: 'devops' },
    update: {},
    create: {
      name: 'DevOps',
      value: 'devops',
    },
  });

  // Create some common technologies
  const commonTechnologies = [
    // Frontend
    { name: 'React', categoryId: frontendCategory.id },
    { name: 'Next.js', categoryId: frontendCategory.id },
    { name: 'Vue.js', categoryId: frontendCategory.id },
    { name: 'Angular', categoryId: frontendCategory.id },
    { name: 'TypeScript', categoryId: frontendCategory.id },
    { name: 'JavaScript', categoryId: frontendCategory.id },
    { name: 'HTML', categoryId: frontendCategory.id },
    { name: 'CSS', categoryId: frontendCategory.id },
    { name: 'Tailwind CSS', categoryId: frontendCategory.id },
    { name: 'Bootstrap', categoryId: frontendCategory.id },

    // Backend
    { name: 'Node.js', categoryId: backendCategory.id },
    { name: 'Node', categoryId: backendCategory.id },
    { name: 'Express.js', categoryId: backendCategory.id },
    { name: 'Python', categoryId: backendCategory.id },
    { name: 'Django', categoryId: backendCategory.id },
    { name: 'Flask', categoryId: backendCategory.id },
    { name: 'Java', categoryId: backendCategory.id },
    { name: 'Spring Boot', categoryId: backendCategory.id },
    { name: 'C#', categoryId: backendCategory.id },
    { name: '.NET', categoryId: backendCategory.id },
    { name: 'PHP', categoryId: backendCategory.id },
    { name: 'Laravel', categoryId: backendCategory.id },
    { name: 'PostgreSQL', categoryId: backendCategory.id },
    { name: 'MongoDB', categoryId: backendCategory.id },
    { name: 'MySQL', categoryId: backendCategory.id },

    // DevOps
    { name: 'Docker', categoryId: devopsCategory.id },
    { name: 'Kubernetes', categoryId: devopsCategory.id },
    { name: 'AWS', categoryId: devopsCategory.id },
    { name: 'Azure', categoryId: devopsCategory.id },
    { name: 'Google Cloud', categoryId: devopsCategory.id },
    { name: 'Git', categoryId: devopsCategory.id },
    { name: 'GitHub Actions', categoryId: devopsCategory.id },
    { name: 'Jenkins', categoryId: devopsCategory.id },
    { name: 'Nginx', categoryId: devopsCategory.id },
    { name: 'Linux', categoryId: devopsCategory.id },
  ];

  const createdTechnologies = [];
  for (const tech of commonTechnologies) {
    const created = await prisma.technology.upsert({
      where: { name: tech.name },
      update: {},
      create: {
        name: tech.name,
        value: tech.name.toLowerCase().replace(/\s+/g, '-'),
        categoryId: tech.categoryId,
      },
    });
    createdTechnologies.push(created);
  }

  return {
    categories: [frontendCategory, backendCategory, devopsCategory],
    technologies: createdTechnologies,
  };
};

export const TechnologyService = {
  createTechnology,
  getAllTechnologies,
  getTechnologiesByCategory,
  getAllTechnologyCategories,
  seedTechnologies,
};
