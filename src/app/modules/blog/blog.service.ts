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
import {
  optimizeImage,
  deleteImage,
  extractFilenameFromUrl,
} from '../../../utils/image';
import { BlogHelper } from './blog.helper';

const createBlog = async (
  authUserId: string,
  payload: ICreateBlog,
  file?: Express.Multer.File
) => {
  // Handle image upload if present
  let featuredImage = undefined;
  if (file) {
    const optimizedImage = await optimizeImage(file.buffer);
    featuredImage = optimizedImage.url;
  }

  // Generate slug from title
  const slug = slugify(payload.title, {
    lower: true,
    strict: true,
  });

  // Check if slug already exists
  const existingBlog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (existingBlog) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Blog with this title already exists'
    );
  }

  const blog = await prisma.blog.create({
    data: {
      ...payload,
      slug,
      featuredImage,
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
  payload: IUpdateBlog,
  file?: Express.Multer.File
) => {
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
      'You are not authorized to update this blog'
    );
  }

  // Handle new image upload if present
  let featuredImage = undefined;
  if (file) {
    // Delete old image if exists
    if (blog.featuredImage) {
      const oldFilename = extractFilenameFromUrl(blog.featuredImage);
      await deleteImage(oldFilename);
    }
    // Upload and optimize new image
    const optimizedImage = await optimizeImage(file.buffer);
    featuredImage = optimizedImage.url;
  }

  // Update slug if title is changed
  let newSlug = undefined;
  if (payload.title) {
    newSlug = slugify(payload.title, {
      lower: true,
      strict: true,
    });
    // Check if new slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: {
        slug: newSlug,
        NOT: {
          id: blog.id,
        },
      },
    });

    if (existingBlog) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Blog with this title already exists'
      );
    }
  }

  const result = await prisma.blog.update({
    where: {
      slug: idOrSlug,
    },
    data: {
      ...payload,
      slug: newSlug,
      featuredImage: featuredImage || undefined,
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

  return result;
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
