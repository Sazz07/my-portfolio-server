import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import {
  ICreateAbout,
  ICreateQuote,
  IUpdateAbout,
  IUpdateQuote,
} from './about.interface';

const createOrUpdateAbout = async (
  authUserId: string,
  payload: ICreateAbout,
  file?: Express.Multer.File
) => {
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

  let imageUrl = payload.image;
  if (file) {
    const uploadResult = await FileUploadHelper.uploadToCloudinary(file);
    imageUrl = uploadResult.secure_url;
  }

  if (profile.about) {
    if (file && profile.about.image) {
      try {
        const publicId = profile.about.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await FileUploadHelper.deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    const result = await prisma.about.update({
      where: {
        profileId: profile.id,
      },
      data: {
        ...payload,
        image: imageUrl,
      },
      include: {
        quotes: true,
      },
    });
    return result;
  }

  const result = await prisma.about.create({
    data: {
      ...payload,
      image: imageUrl,
      profileId: profile.id,
    },
    include: {
      quotes: true,
    },
  });

  return result;
};

const getAboutByProfile = async (profileId: string) => {
  const about = await prisma.about.findUnique({
    where: {
      profileId,
    },
    include: {
      quotes: true,
    },
  });

  if (!about) {
    throw new ApiError(httpStatus.NOT_FOUND, 'About section not found');
  }

  return about;
};

const updateAbout = async (
  authUserId: string,
  payload: IUpdateAbout,
  file?: Express.Multer.File
) => {
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

  let imageUrl = payload.image;
  if (file) {
    const uploadResult = await FileUploadHelper.uploadToCloudinary(file);
    imageUrl = uploadResult.secure_url;

    if (profile.about.image) {
      try {
        const publicId = profile.about.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await FileUploadHelper.deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }
  }

  const result = await prisma.about.update({
    where: {
      profileId: profile.id,
    },
    data: {
      ...payload,
      ...(imageUrl && { image: imageUrl }),
    },
    include: {
      quotes: true,
    },
  });

  return result;
};

// Quote services
const createQuote = async (authUserId: string, payload: ICreateQuote) => {
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

  const result = await prisma.quote.create({
    data: {
      ...payload,
      aboutId: profile.about.id,
    },
  });

  return result;
};

const getAllQuotes = async (authUserId: string) => {
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

  const quotes = await prisma.quote.findMany({
    where: {
      aboutId: profile.about.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return quotes;
};

const getRandomQuote = async (profileId: string) => {
  const about = await prisma.about.findUnique({
    where: {
      profileId,
    },
  });

  if (!about) {
    throw new ApiError(httpStatus.NOT_FOUND, 'About section not found');
  }

  const quotesCount = await prisma.quote.count({
    where: {
      aboutId: about.id,
    },
  });

  if (quotesCount === 0) {
    return null;
  }

  // Get a random quote
  const skip = Math.floor(Math.random() * quotesCount);
  const randomQuote = await prisma.quote.findFirst({
    where: {
      aboutId: about.id,
    },
    skip,
  });

  return randomQuote;
};

const updateQuote = async (
  authUserId: string,
  quoteId: string,
  payload: IUpdateQuote
) => {
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

  // Check if the quote exists and belongs to this user's about section
  const quote = await prisma.quote.findUnique({
    where: {
      id: quoteId,
    },
  });

  if (!quote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quote not found');
  }

  if (quote.aboutId !== profile.about.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot update this quote');
  }

  const result = await prisma.quote.update({
    where: {
      id: quoteId,
    },
    data: payload,
  });

  return result;
};

const deleteQuote = async (authUserId: string, quoteId: string) => {
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

  // Check if the quote exists and belongs to this user's about section
  const quote = await prisma.quote.findUnique({
    where: {
      id: quoteId,
    },
  });

  if (!quote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quote not found');
  }

  if (quote.aboutId !== profile.about.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot delete this quote');
  }

  await prisma.quote.delete({
    where: {
      id: quoteId,
    },
  });

  return true;
};

export const AboutService = {
  createOrUpdateAbout,
  getAboutByProfile,
  updateAbout,
  createQuote,
  getAllQuotes,
  getRandomQuote,
  updateQuote,
  deleteQuote,
};
