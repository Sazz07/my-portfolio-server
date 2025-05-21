import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { IUploadFile } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/common';
import { Project, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import ApiError from '../../../errors/ApiError';

const createProject = async (
  userId: string,
  payload: {
    title: string;
    description: string;
    liveUrl?: string;
    githubUrl?: string;
    technologies?: string[];
  },
  file?: IUploadFile
): Promise<Project> => {
  let imageUrl: string | undefined;

  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    imageUrl = uploadedImage.secure_url;
  }

  const result = await prisma.project.create({
    data: {
      ...payload,
      image: imageUrl,
      userId,
    },
  });

  return result;
};

const getAllProjects = async (
  filters: {
    searchTerm?: string;
    status?: string;
  },
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const whereConditions: Prisma.ProjectWhereInput = {};

  if (filters.searchTerm) {
    whereConditions.OR = [
      {
        title: {
          contains: filters.searchTerm,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: filters.searchTerm,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (filters.status) {
    whereConditions.status = filters.status as any;
  }

  const result = await prisma.project.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : undefined,
  });

  const total = await prisma.project.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleProject = async (id: string): Promise<Project> => {
  const result = await prisma.project.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return result;
};

const updateProject = async (
  id: string,
  userId: string,
  payload: Partial<Project>,
  file?: IUploadFile
): Promise<Project> => {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  if (project.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot update this project');
  }

  let imageUrl: string | undefined;

  if (file) {
    // Delete old image if exists
    if (project.image) {
      const publicId = project.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await FileUploadHelper.deleteFromCloudinary(publicId);
      }
    }

    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    imageUrl = uploadedImage.secure_url;
  }

  const result = await prisma.project.update({
    where: { id },
    data: {
      ...payload,
      ...(imageUrl && { image: imageUrl }),
    },
  });

  return result;
};

const deleteProject = async (id: string, userId: string): Promise<void> => {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  if (project.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot delete this project');
  }

  // Delete project image from cloudinary if exists
  if (project.image) {
    const publicId = project.image.split('/').pop()?.split('.')[0];
    if (publicId) {
      await FileUploadHelper.deleteFromCloudinary(publicId);
    }
  }

  await prisma.project.delete({
    where: { id },
  });
};

export const ProjectService = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};
