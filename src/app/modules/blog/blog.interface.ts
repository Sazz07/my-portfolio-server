import { BlogStatus } from '@prisma/client';

export type ICreateBlog = {
  title: string;
  summary?: string;
  content: string;
  featuredImage?: string;
  status?: BlogStatus;
  tags?: string[];
  categoryId: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type IUpdateBlog = Partial<ICreateBlog>;

export type ICreateBlogCategory = {
  name: string;
  description?: string;
};

export type IUpdateBlogCategory = Partial<ICreateBlogCategory>;

export type IBlogWithAuthorCategory = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  featuredImage?: string;
  status: BlogStatus;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName?: string;
      profileImage?: string;
    };
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
};
