export type ICreateEducation = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  activities?: string;
  description?: string[];
};

export type IUpdateEducation = Partial<ICreateEducation>;

export type IEducationResponse = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  grade?: string;
  activities?: string;
  description?: string[];
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
};
