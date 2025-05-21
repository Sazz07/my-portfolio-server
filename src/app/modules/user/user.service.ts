import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { IUploadFile } from '../../../interfaces/common';
import { User, Profile } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

type UserWithProfile = Partial<User> & {
  profile: Profile | undefined;
};

const getProfile = async (userId: string): Promise<UserWithProfile> => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      profile: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result as UserWithProfile;
};

const updateProfile = async (
  userId: string,
  payload: Partial<Profile>
): Promise<Profile> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.profile.update({
    where: { userId: user.id },
    data: payload,
  });

  return result;
};

const updateProfileImage = async (
  userId: string,
  file: IUploadFile
): Promise<Profile> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

  if (!uploadedImage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
  }

  // Delete old image if exists
  if (user.profile?.profileImage) {
    const publicId = user.profile.profileImage.split('/').pop()?.split('.')[0];
    if (publicId) {
      await FileUploadHelper.deleteFromCloudinary(publicId);
    }
  }

  const result = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      profileImage: uploadedImage.secure_url,
    },
  });

  return result;
};

export const UserService = {
  getProfile,
  updateProfile,
  updateProfileImage,
};
