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
    features?: string[];
    techStack?: { frontend: string[]; backend: string[]; devops: string[] };
    liveUrl?: string;
    githubUrl?: string;
    categoryId: string;
  },
  files?: Express.Multer.File[]
): Promise<Project> => {
  let imageUrl: string | undefined;
  let imageUrls: string[] = [];
  let techStackData: any = null;
  let featuresArray: string[] = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file) =>
      FileUploadHelper.uploadToCloudinary(file)
    );

    const uploadResults = await Promise.all(uploadPromises);

    imageUrls = uploadResults.map((result) => result.secure_url);

    // Set the first image as featured image by default
    imageUrl = imageUrls[0];
  }

  if (payload.features && payload.features.length > 0) {
    featuresArray =
      typeof payload.features === 'string'
        ? JSON.parse(payload.features)
        : payload.features;
  }

  if (payload.techStack) {
    techStackData =
      typeof payload.techStack === 'string'
        ? JSON.parse(payload.techStack)
        : payload.techStack;

    // Extract all technologies from techStack and save them to Technology table with categories
    const techPromises: Promise<any>[] = [];

    // Handle frontend technologies
    if (techStackData.frontend && techStackData.frontend.length > 0) {
      const frontendCategory = await prisma.technologyCategory.upsert({
        where: { value: 'frontend' },
        update: {},
        create: {
          name: 'Frontend',
          value: 'frontend',
        },
      });

      techStackData.frontend.forEach((tech: string) => {
        techPromises.push(
          prisma.technology.upsert({
            where: { name: tech },
            update: {},
            create: {
              name: tech,
              value: tech.toLowerCase().replace(/\s+/g, '-'),
              categoryId: frontendCategory.id,
            },
          })
        );
      });
    }

    // Handle backend technologies
    if (techStackData.backend && techStackData.backend.length > 0) {
      const backendCategory = await prisma.technologyCategory.upsert({
        where: { value: 'backend' },
        update: {},
        create: {
          name: 'Backend',
          value: 'backend',
        },
      });

      techStackData.backend.forEach((tech: string) => {
        techPromises.push(
          prisma.technology.upsert({
            where: { name: tech },
            update: {},
            create: {
              name: tech,
              value: tech.toLowerCase().replace(/\s+/g, '-'),
              categoryId: backendCategory.id,
            },
          })
        );
      });
    }

    // Handle devops technologies
    if (techStackData.devops && techStackData.devops.length > 0) {
      const devopsCategory = await prisma.technologyCategory.upsert({
        where: { value: 'devops' },
        update: {},
        create: {
          name: 'DevOps',
          value: 'devops',
        },
      });

      techStackData.devops.forEach((tech: string) => {
        techPromises.push(
          prisma.technology.upsert({
            where: { name: tech },
            update: {},
            create: {
              name: tech,
              value: tech.toLowerCase().replace(/\s+/g, '-'),
              categoryId: devopsCategory.id,
            },
          })
        );
      });
    }

    await Promise.all(techPromises);
  }

  const result = await prisma.project.create({
    data: {
      title: payload.title,
      description: payload.description,
      features: featuresArray,
      techStack: techStackData,
      featuredImage: imageUrl,
      images: imageUrls,
      liveUrl: payload.liveUrl,
      githubUrl: payload.githubUrl,
      userId,
      categoryId: payload.categoryId,
    },
  });

  return result;
};

const getAllProjects = async (
  filters: {
    searchTerm?: string;
    status?: string;
    categoryId?: string;
    type?: string;
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
      {
        techStack: {
          path: ['frontend'],
          array_contains: [filters.searchTerm],
        },
      },
      {
        techStack: {
          path: ['backend'],
          array_contains: [filters.searchTerm],
        },
      },
      {
        techStack: {
          path: ['devops'],
          array_contains: [filters.searchTerm],
        },
      },
    ];
  }

  if (filters.status) {
    whereConditions.status = filters.status as any;
  }

  if (filters.categoryId) {
    whereConditions.categoryId = filters.categoryId;
  }

  // TODO: Uncomment when Prisma client is regenerated
  // if (filters.type) {
  //   whereConditions.type = filters.type;
  // }

  const result = await prisma.project.findMany({
    where: whereConditions,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
  });

  const total = await prisma.project.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
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
  const allImages = [...imagesToKeep, ...newImageUrls];
  if ((files && files.length > 0) || imagesToRemove.length > 0) {
    updateData.images = allImages;
  }

  // Handle featuredImage logic
  let featuredImage = updateData.featuredImage || project.featuredImage;

  // If featuredImage is being removed or doesn't exist in remaining images, reset it
  if (featuredImage && !allImages.includes(featuredImage)) {
    featuredImage = allImages.length > 0 ? allImages[0] : null;
  }

  // If no featuredImage is set but we have images, set the first one as featured
  if (!featuredImage && allImages.length > 0) {
    featuredImage = allImages[0];
  }

  // If we're removing the featured image and have other images, set the first remaining as featured
  if (
    project.featuredImage &&
    imagesToRemove.includes(project.featuredImage) &&
    allImages.length > 0
  ) {
    featuredImage = allImages[0];
  }

  updateData.featuredImage = featuredImage;

  if (updateData.categoryId) {
    updateData.categoryId = updateData.categoryId;
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
