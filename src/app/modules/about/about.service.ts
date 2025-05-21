import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICreateAbout, IUpdateAbout } from './about.interface';

const createOrUpdateAbout = async (
  authUserId: string,
  payload: ICreateAbout
) => {
  // Get the user's profile
  const profile = await prisma.profile.findUnique({
    where: {
      userId: authUserId,
    },
    include: {
      about: true,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  // If about section already exists, update it
  if (profile.about) {
    const result = await prisma.about.update({
      where: {
        profileId: profile.id,
      },
      data: payload,
    });
    return result;
  }

  // If about section doesn't exist, create it
  const result = await prisma.about.create({
    data: {
      ...payload,
      profileId: profile.id,
    },
  });

  return result;
};

const getAboutByProfile = async (profileId: string) => {
  const about = await prisma.about.findUnique({
    where: {
      profileId,
    },
  });

  if (!about) {
    throw new ApiError(httpStatus.NOT_FOUND, 'About section not found');
  }

  return about;
};

const updateAbout = async (authUserId: string, payload: IUpdateAbout) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: authUserId,
    },
    include: {
      about: true,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  if (!profile.about) {
    throw new ApiError(httpStatus.NOT_FOUND, 'About section not found');
  }

  const result = await prisma.about.update({
    where: {
      profileId: profile.id,
    },
    data: payload,
  });

  return result;
};

export const AboutService = {
  createOrUpdateAbout,
  getAboutByProfile,
  updateAbout,
};
