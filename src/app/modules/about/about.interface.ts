export type ICreateAbout = {
  introduction: string;
  overview: string;
  servicesOffered: string[];
  toolsAndTech: string[];
  achievements: string[];
  metaTitle?: string;
  metaDescription?: string;
};

export type IUpdateAbout = Partial<ICreateAbout>;

export type IAboutResponse = {
  id: string;
  introduction: string;
  overview: string;
  servicesOffered: string[];
  toolsAndTech: string[];
  achievements: string[];
  metaTitle?: string;
  metaDescription?: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
};
