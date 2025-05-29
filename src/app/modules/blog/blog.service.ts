import httpStatus from 'http-status';
import slugify from 'slugify';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import {
  ICreateBlog,
  IUpdateBlog,
  ICreateBlogCategory,
  IUpdateBlogCategory,
} from './blog.interface';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { BlogStatus } from '@prisma/client';
import { deleteImage, extractFilenameFromUrl } from '../../../utils/image';
import { BlogHelper } from './blog.helper';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';

const createBlog = async (
  authUserId: string,
  payload: ICreateBlog,
  files?: Express.Multer.File[]
) => {
  let featuredImage = undefined;
  let imageUrls: string[] = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file) =>
      FileUploadHelper.uploadToCloudinary(file)
    );

    const uploadResults = await Promise.all(uploadPromises);

    imageUrls = uploadResults.map((result) => result.secure_url);

    featuredImage = imageUrls[0];
  }

  const slug = slugify(payload.title, {
    lower: true,
    strict: true,
  });

  const existingBlog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (existingBlog) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Blog with this title already exists'
    );
  }

  const tags =
    typeof payload.tags === 'string' ? JSON.parse(payload.tags) : payload.tags;

  const blog = await prisma.blog.create({
    data: {
      ...payload,
      tags,
      slug,
      featuredImage,
      images: imageUrls,
      userId: authUserId,
    },
  });

  return blog;
};

const getAllBlogs = async (
  options: IPaginationOptions,
  filters: { status?: BlogStatus; categoryId?: string; searchTerm?: string }
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { status, categoryId, searchTerm } = filters;

  const whereConditions: any = {
    status: status || BlogStatus.PUBLISHED,
  };

  if (categoryId) {
    whereConditions.categoryId = categoryId;
  }

  if (searchTerm) {
    whereConditions.OR = [
      {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        content: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        tags: {
          has: searchTerm,
        },
      },
    ];
  }

  const [result, total] = await Promise.all([
    prisma.blog.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.blog.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUserBlogs = async (
  userId: string,
  options: IPaginationOptions,
  filters: { status?: BlogStatus; categoryId?: string; searchTerm?: string }
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { status, categoryId, searchTerm } = filters;

  const whereConditions: any = {
    userId,
  };

  if (status) {
    whereConditions.status = status;
  }

  if (categoryId) {
    whereConditions.categoryId = categoryId;
  }

  if (searchTerm) {
    whereConditions.OR = [
      {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        content: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        tags: {
          has: searchTerm,
        },
      },
    ];
  }

  const [result, total] = await Promise.all([
    prisma.blog.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.blog.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBlog = async (idOrSlug: string) => {
  const blog = await prisma.blog.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  return blog;
};

const updateBlog = async (
  idOrSlug: string,
  authUser: JwtPayload,
  payload: IUpdateBlog & { imagesToRemove: string[] },
  files?: Express.Multer.File[]
) => {
  const blog = await prisma.blog.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  // Check if user is authorized to update this blog
  if (blog.userId !== authUser.userId && authUser.role !== 'ADMIN') {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this blog'
    );
  }

  // Handle image uploads if files are provided
  let newImageUrls: string[] = [];
  if (files && files.length > 0) {
    const uploadPromises = files.map((file) =>
      FileUploadHelper.uploadToCloudinary(file)
    );

    const uploadResults = await Promise.all(uploadPromises);
    newImageUrls = uploadResults.map((result) => result.secure_url);
  }

  let imagesToRemove: string[] = [];
  if (payload.imagesToRemove) {
    imagesToRemove = Array.isArray(payload.imagesToRemove)
      ? payload.imagesToRemove
      : JSON.parse(payload.imagesToRemove as string);
  }

  // Get current images and filter out ones to remove
  let currentImages = blog.images || [];
  if (imagesToRemove.length > 0) {
    // Delete images from Cloudinary
    for (const imageUrl of imagesToRemove) {
      try {
        const publicId = extractFilenameFromUrl(imageUrl);
        if (publicId) {
          await deleteImage(publicId);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Filter out removed images
    currentImages = currentImages.filter(
      (img) => !imagesToRemove.includes(img)
    );
  }

  // Combine existing images with new ones
  const updatedImages = [...currentImages, ...newImageUrls];

  // Update featuredImage if needed
  let featuredImage = blog.featuredImage;
  if (featuredImage && imagesToRemove.includes(featuredImage)) {
    featuredImage = updatedImages.length > 0 ? updatedImages[0] : null;
  } else if (newImageUrls.length > 0 && !featuredImage) {
    featuredImage = newImageUrls[0];
  }

  // Parse tags if they come as stringified JSON
  const tags =
    typeof payload.tags === 'string' ? JSON.parse(payload.tags) : payload.tags;

  // Update the blog
  const updatedBlog = await prisma.blog.update({
    where: { id: blog.id },
    data: {
      ...payload,
      tags,
      images: updatedImages,
      featuredImage,
    },
  });

  return updatedBlog;
};

const deleteBlog = async (idOrSlug: string, authUser: JwtPayload) => {
  const blog = await prisma.blog.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  if (blog.userId !== authUser.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this blog'
    );
  }

  // Delete associated image if exists
  if (blog.featuredImage) {
    const filename = extractFilenameFromUrl(blog.featuredImage);
    await deleteImage(filename);
  }

  const result = await prisma.blog.delete({
    where: {
      slug: idOrSlug,
    },
  });

  return result;
};

const createCategory = async (payload: ICreateBlogCategory) => {
  const existingSlugs = await prisma.blogCategory.findMany({
    select: { slug: true },
  });

  const baseSlug = BlogHelper.generateSlug(payload.name);
  const slug = BlogHelper.ensureUniqueSlug(
    baseSlug,
    existingSlugs.map((s) => s.slug)
  );

  const category = await prisma.blogCategory.create({
    data: {
      ...payload,
      slug,
    },
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.blogCategory.findMany({
    include: {
      _count: {
        select: {
          blogs: true,
        },
      },
    },
  });

  return categories;
};

const getSingleCategory = async (idOrSlug: string) => {
  const category = await prisma.blogCategory.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      _count: {
        select: {
          blogs: true,
        },
      },
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return category;
};

const updateCategory = async (
  idOrSlug: string,
  payload: IUpdateBlogCategory
) => {
  const category = await prisma.blogCategory.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  let slug = category.slug;
  if (payload.name) {
    const existingSlugs = await prisma.blogCategory.findMany({
      where: {
        NOT: {
          id: category.id,
        },
      },
      select: { slug: true },
    });

    const baseSlug = BlogHelper.generateSlug(payload.name);
    slug = BlogHelper.ensureUniqueSlug(
      baseSlug,
      existingSlugs.map((s) => s.slug)
    );
  }

  const result = await prisma.blogCategory.update({
    where: {
      id: category.id,
    },
    data: {
      ...payload,
      slug,
    },
  });

  return result;
};

const deleteCategory = async (idOrSlug: string) => {
  const category = await prisma.blogCategory.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      _count: {
        select: {
          blogs: true,
        },
      },
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  if (category._count.blogs > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete category with existing blogs'
    );
  }

  const result = await prisma.blogCategory.delete({
    where: {
      id: category.id,
    },
  });

  return result;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getUserBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
