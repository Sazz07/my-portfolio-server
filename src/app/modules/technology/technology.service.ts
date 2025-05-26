import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Technology } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ICreateTechnology, IUpdateTechnology } from './technology.interface';

const createTechnology = async (
  payload: ICreateTechnology
): Promise<Technology> => {
  // Check if technology already exists
  const existingTechnology = await prisma.technology.findFirst({
    where: {
      OR: [{ name: payload.name }, { value: payload.value }],
    },
  });

  if (existingTechnology) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Technology already exists');
  }

  const result = await prisma.technology.create({
    data: payload,
  });

  return result;
};

const getAllTechnologies = async (): Promise<Technology[]> => {
  const result = await prisma.technology.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return result;
};

const getSingleTechnology = async (id: string): Promise<Technology> => {
  const result = await prisma.technology.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
  }

  return result;
};

const updateTechnology = async (
  id: string,
  payload: IUpdateTechnology
): Promise<Technology> => {
  // Check if technology exists
  const technology = await prisma.technology.findUnique({
    where: {
      id,
    },
  });

  if (!technology) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
  }

  const result = await prisma.technology.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteTechnology = async (id: string): Promise<void> => {
  // Check if technology exists
  const technology = await prisma.technology.findUnique({
    where: {
      id,
    },
  });

  if (!technology) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
  }

  await prisma.technology.delete({
    where: {
      id,
    },
  });
};

export const TechnologyService = {
  createTechnology,
  getAllTechnologies,
  getSingleTechnology,
  updateTechnology,
  deleteTechnology,
};
