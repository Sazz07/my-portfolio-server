import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICreateExperience, IUpdateExperience } from './experience.interface';
import { JwtPayload } from 'jsonwebtoken';

const createExperience = async (
  authUserId: string,
  payload: ICreateExperience
) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: authUserId,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  const experience = await prisma.experience.create({
    data: {
      ...payload,
      startDate: new Date(payload.startDate),
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
      profileId: profile.id,
    },
  });

  return experience;
};

const getAllExperiences = async () => {
  const experiences = await prisma.experience.findMany({
    orderBy: {
      startDate: 'desc',
    },
  });

  return experiences;
};

const getExperiencesByProfile = async (profileId: string) => {
  const experiences = await prisma.experience.findMany({
    where: {
      profileId,
    },
    orderBy: {
      startDate: 'desc',
    },
  });

  return experiences;
};

const getSingleExperience = async (id: string) => {
  const experience = await prisma.experience.findUnique({
    where: {
      id,
    },
  });

  if (!experience) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
  }

  return experience;
};

const updateExperience = async (
  id: string,
  authUser: JwtPayload,
  payload: IUpdateExperience
) => {
  const experience = await prisma.experience.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!experience) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
  }

  if (experience.profile.userId !== authUser.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this experience'
    );
  }

  const result = await prisma.experience.update({
    where: {
      id,
    },
    data: {
      ...payload,
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
    },
  });

  return result;
};

const deleteExperience = async (id: string, authUser: JwtPayload) => {
  const experience = await prisma.experience.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!experience) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
  }

  if (experience.profile.userId !== authUser.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this experience'
    );
  }

  const result = await prisma.experience.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ExperienceService = {
  createExperience,
  getAllExperiences,
  getExperiencesByProfile,
  getSingleExperience,
  updateExperience,
  deleteExperience,
};
