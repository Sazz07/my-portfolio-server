import prisma from '../../../shared/prisma';
import { ProjectCategory } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const createCategory = async (payload: { name: string }) => {
  const slug = slugify(payload.name);
  const exists = await prisma.projectCategory.findUnique({ where: { slug } });
  if (exists) {
    throw new ApiError(httpStatus.CONFLICT, 'Category already exists');
  }
  const result = await prisma.projectCategory.create({
    data: {
      name: payload.name,
      slug,
    },
  });
  return result;
};

const getAllCategories = async (): Promise<ProjectCategory[]> => {
  return prisma.projectCategory.findMany({ orderBy: { name: 'asc' } });
};

const getSingleCategory = async (id: string): Promise<ProjectCategory> => {
  const result = await prisma.projectCategory.findUnique({ where: { id } });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return result;
};

export const ProjectCategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
};
