import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { SkillCategory } from '@prisma/client';
import {
  ICreateSkillCategory,
  IUpdateSkillCategory,
} from './skillCategory.interface';

const createSkillCategory = async (
  payload: ICreateSkillCategory
): Promise<SkillCategory> => {
  // Check if category already exists
  const existingCategory = await prisma.skillCategory.findFirst({
    where: { name: payload.name },
  });
  if (existingCategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category already exists');
  }
  const result = await prisma.skillCategory.create({
    data: payload,
  });
  return result;
};

const getAllSkillCategories = async (): Promise<SkillCategory[]> => {
  const result = await prisma.skillCategory.findMany({
    orderBy: { name: 'asc' },
  });
  return result;
};

const getSingleSkillCategory = async (id: string): Promise<SkillCategory> => {
  const result = await prisma.skillCategory.findUnique({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return result;
};

const updateSkillCategory = async (
  id: string,
  payload: IUpdateSkillCategory
): Promise<SkillCategory> => {
  const category = await prisma.skillCategory.findUnique({
    where: { id },
  });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const result = await prisma.skillCategory.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteSkillCategory = async (id: string): Promise<void> => {
  const category = await prisma.skillCategory.findUnique({
    where: { id },
  });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await prisma.skillCategory.delete({
    where: { id },
  });
};

export const SkillCategoryService = {
  createSkillCategory,
  getAllSkillCategories,
  getSingleSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
};
