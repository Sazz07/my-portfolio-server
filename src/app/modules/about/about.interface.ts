export type ICreateAbout = {
  introduction: string;
  overview: string;
  servicesOffered: string[];
  toolsAndTech: string[];
  achievements: string[];
  metaTitle?: string;
  metaDescription?: string;
  image?: string;
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
  image?: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  quotes?: IQuoteResponse[];
};

// Quote interfaces
export type ICreateQuote = {
  text: string;
  author: string;
  source?: string;
};

export type IUpdateQuote = Partial<ICreateQuote>;

export type IQuoteResponse = {
  id: string;
  text: string;
  author: string;
  source?: string;
  aboutId: string;
  createdAt: Date;
  updatedAt: Date;
};
