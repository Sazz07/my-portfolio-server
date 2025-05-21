import { EmploymentType } from '@prisma/client';

export type ICreateExperience = {
  title: string;
  company: string;
  location?: string;
  type: EmploymentType;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string[];
};

export type IUpdateExperience = {
  title?: string;
  company?: string;
  location?: string;
  type?: EmploymentType;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string[];
};
