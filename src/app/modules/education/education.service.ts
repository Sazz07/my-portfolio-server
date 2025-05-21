import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICreateEducation, IUpdateEducation } from './education.interface';
import { JwtPayload } from 'jsonwebtoken';

const createEducation = async (
  authUserId: string,
  payload: ICreateEducation
) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: authUserId,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  const education = await prisma.education.create({
    data: {
      ...payload,
      startDate: new Date(payload.startDate),
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
      profileId: profile.id,
    },
  });

  return education;
};

const getAllEducation = async () => {
  const education = await prisma.education.findMany({
    orderBy: [
      {
        isCurrent: 'desc',
      },
      {
        startDate: 'desc',
      },
    ],
  });

  return education;
};

const getEducationByProfile = async (profileId: string) => {
  const education = await prisma.education.findMany({
    where: {
      profileId,
    },
    orderBy: [
      {
        isCurrent: 'desc',
      },
      {
        startDate: 'desc',
      },
    ],
  });

  return education;
};

const getSingleEducation = async (id: string) => {
  const education = await prisma.education.findUnique({
    where: {
      id,
    },
  });

  if (!education) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
  }

  return education;
};

const updateEducation = async (
  id: string,
  authUser: JwtPayload,
  payload: IUpdateEducation
) => {
  const education = await prisma.education.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!education) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
  }

  if (education.profile.userId !== authUser.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this education'
    );
  }

  const result = await prisma.education.update({
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

const deleteEducation = async (id: string, authUser: JwtPayload) => {
  const education = await prisma.education.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!education) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
  }

  if (education.profile.userId !== authUser.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this education'
    );
  }

  const result = await prisma.education.delete({
    where: {
      id,
    },
  });

  return result;
};

export const EducationService = {
  createEducation,
  getAllEducation,
  getEducationByProfile,
  getSingleEducation,
  updateEducation,
  deleteEducation,
};
