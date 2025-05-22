import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
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
  files?: Express.Multer.File[]
): Promise<Project> => {
  let imageUrl: string | undefined;
  let imageUrls: string[] = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file) =>
      FileUploadHelper.uploadToCloudinary(file)
    );

    const uploadResults = await Promise.all(uploadPromises);

    imageUrls = uploadResults.map((result) => result.secure_url);

    imageUrl = imageUrls[0];
  }

  const result = await prisma.project.create({
    data: {
      ...payload,
      images: imageUrls,
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
  files?: Express.Multer.File[]
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

  let imageUrls: string[] = [];

  if (files && files.length > 0) {
    if (project.images && project.images.length > 0) {
      const deletePromises = project.images.map((image) => {
        const publicId = image.split('/').pop()?.split('.')[0];
        if (publicId) {
          return FileUploadHelper.deleteFromCloudinary(publicId);
        }
        return Promise.resolve(true);
      });

      await Promise.all(deletePromises);
    }

    // Upload new images
    const uploadPromises = files.map((file) =>
      FileUploadHelper.uploadToCloudinary(file)
    );

    const uploadResults = await Promise.all(uploadPromises);
    imageUrls = uploadResults.map((result) => result.secure_url);
  }

  const updateData: any = {
    ...payload,
  };

  if (files && files.length > 0) {
    updateData.images = imageUrls;
  }

  const result = await prisma.project.update({
    where: { id },
    data: updateData,
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
