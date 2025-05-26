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
  let technologiesArray: string[] = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file) =>
      FileUploadHelper.uploadToCloudinary(file)
    );

    const uploadResults = await Promise.all(uploadPromises);

    imageUrls = uploadResults.map((result) => result.secure_url);

    imageUrl = imageUrls[0];
  }

  if (payload.technologies && payload.technologies.length > 0) {
    technologiesArray =
      typeof payload.technologies === 'string'
        ? JSON.parse(payload.technologies)
        : payload.technologies;

    const techPromises = technologiesArray.map(async (tech: string) => {
      const existingTech = await prisma.technology.findFirst({
        where: {
          OR: [{ name: tech }, { value: tech }],
        },
      });

      if (!existingTech) {
        await prisma.technology.create({
          data: {
            name: tech,
            value: tech.toLowerCase().replace(/\s+/g, '-'),
          },
        });
      }
    });

    await Promise.all(techPromises);
  }

  const result = await prisma.project.create({
    data: {
      ...payload,
      technologies: technologiesArray,
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
  payload: Partial<Project> & { imagesToRemove?: string },
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

  let newImageUrls: string[] = [];
  let imagesToKeep: string[] = [];
  let imagesToRemove: string[] = [];

  // Parse images to remove if provided
  if (payload.imagesToRemove && typeof payload.imagesToRemove === 'string') {
    try {
      imagesToRemove = JSON.parse(payload.imagesToRemove);
    } catch (error) {
      console.error('Error parsing imagesToRemove:', error);
    }
  }

  // Determine which existing images to keep
  if (project.images && project.images.length > 0) {
    imagesToKeep = project.images.filter(
      (img) => !imagesToRemove.includes(img)
    );
  }

  // Delete images from Cloudinary if needed
  if (imagesToRemove.length > 0) {
    const deletePromises = imagesToRemove.map((image) => {
      const publicId = image.split('/').pop()?.split('.')[0];
      if (publicId) {
        return FileUploadHelper.deleteFromCloudinary(publicId);
      }
      return Promise.resolve(true);
    });

    await Promise.all(deletePromises);
  }

  // Upload new images if provided
  if (files && files.length > 0) {
    const uploadPromises = files.map((file) =>
      FileUploadHelper.uploadToCloudinary(file)
    );

    const uploadResults = await Promise.all(uploadPromises);
    newImageUrls = uploadResults.map((result) => result.secure_url);
  }

  const updateData: any = { ...payload };

  // Parse technologies if it's a string
  if (typeof updateData.technologies === 'string') {
    try {
      updateData.technologies = JSON.parse(updateData.technologies);
    } catch (error) {
      console.error('Error parsing technologies:', error);
      // If parsing fails, remove the field to avoid errors
      delete updateData.technologies;
    }
  }

  // Remove id and imagesToRemove from updateData if they exist
  if (updateData.id) {
    delete updateData.id;
  }

  if (updateData.imagesToRemove) {
    delete updateData.imagesToRemove;
  }

  // Combine kept images with new images
  if ((files && files.length > 0) || imagesToRemove.length > 0) {
    updateData.images = [...imagesToKeep, ...newImageUrls];
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
