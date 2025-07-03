import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
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
  payload: Partial<Profile>,
  file?: Express.Multer.File
): Promise<Profile> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Handle image upload if file is provided
  let profileImageUrl = undefined;

  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

    if (!uploadedImage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image upload failed');
    }

    // Delete old image if exists
    if (user.profile?.profileImage) {
      const publicId = user.profile.profileImage
        .split('/')
        .pop()
        ?.split('.')[0];
      if (publicId) {
        await FileUploadHelper.deleteFromCloudinary(publicId);
      }
    }

    profileImageUrl = uploadedImage.secure_url;
  }

  // Update profile with both data and image if provided
  const result = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      ...payload,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
    },
  });

  return result;
};

const getPublicProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      profile: {
        include: {
          skills: { include: { category: true } },
          experiences: true,
          educations: true,
          about: { include: { quotes: true } },
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

export const UserService = {
  getProfile,
  updateProfile,
  getPublicProfile,
};
