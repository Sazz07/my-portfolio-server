import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ICreateSkill, IUpdateSkill } from './skill.interface';
import ApiError from '../../../errors/ApiError';
import { Skill } from '@prisma/client';
import { queryBuilder } from '../../../shared/queryBuilder';

const createSkill = async (
  userId: string,
  payload: ICreateSkill
): Promise<Skill> => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  const result = await prisma.skill.create({
    data: {
      ...payload,
      profileId: profile.id,
    },
    include: { category: true },
  });

  return result;
};

const getAllSkills = async (filter: { categoryId?: string }) => {
  const conditions = queryBuilder.buildFilterConditions(filter);
  const where = queryBuilder.buildWhereConditions(conditions);
  const result = await prisma.skill.findMany({
    where,
    orderBy: {
      proficiency: 'desc',
    },
    include: { category: true },
  });

  return result;
};

const getSkillsByProfile = async (profileId: string) => {
  const result = await prisma.skill.findMany({
    where: {
      profileId,
    },
    orderBy: {
      proficiency: 'desc',
    },
  });

  return result;
};

const getSingleSkill = async (id: string): Promise<Skill> => {
  const result = await prisma.skill.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
  }

  return result;
};

const updateSkill = async (
  id: string,
  userId: string,
  payload: IUpdateSkill
): Promise<Skill> => {
  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!skill) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
  }

  if (skill.profile.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot update this skill');
  }

  const result = await prisma.skill.update({
    where: { id },
    data: payload,
    include: { category: true },
  });

  return result;
};

const deleteSkill = async (id: string, userId: string): Promise<void> => {
  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!skill) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
  }

  if (skill.profile.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot delete this skill');
  }

  await prisma.skill.delete({
    where: { id },
  });
};

const getUsedSkillCategories = async () => {
  const categories = await prisma.skillCategory.findMany({
    where: {
      skills: {
        some: {},
      },
    },
    orderBy: { name: 'asc' },
  });
  return categories;
};

export const SkillService = {
  createSkill,
  getAllSkills,
  getSkillsByProfile,
  getSingleSkill,
  updateSkill,
  deleteSkill,
  getUsedSkillCategories,
};
