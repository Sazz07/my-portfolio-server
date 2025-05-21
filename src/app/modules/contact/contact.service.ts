import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ICreateContact, IUpdateContact } from './contact.interface';
import ApiError from '../../../errors/ApiError';
import { Contact } from '@prisma/client';
import { IPaginationOptions } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const createContact = async (
  profileId: string,
  payload: ICreateContact
): Promise<Contact> => {
  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  const result = await prisma.contact.create({
    data: {
      ...payload,
      profileId,
    },
  });

  return result;
};

const getAllContacts = async (userId: string, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  const result = await prisma.contact.findMany({
    where: {
      profileId: profile.id,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
  });

  const total = await prisma.contact.count({
    where: {
      profileId: profile.id,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleContact = async (
  id: string,
  userId: string
): Promise<Contact> => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  const result = await prisma.contact.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }

  if (result.profileId !== profile.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot view this contact');
  }

  return result;
};

const updateContact = async (
  id: string,
  userId: string,
  payload: IUpdateContact
): Promise<Contact> => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }

  if (contact.profileId !== profile.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot update this contact');
  }

  const result = await prisma.contact.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteContact = async (id: string, userId: string): Promise<void> => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }

  if (contact.profileId !== profile.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot delete this contact');
  }

  await prisma.contact.delete({
    where: { id },
  });
};

export const ContactService = {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContact,
  deleteContact,
};
