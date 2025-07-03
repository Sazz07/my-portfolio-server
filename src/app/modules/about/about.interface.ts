export type ICreateAbout = {
  journey: string;
  values: string;
  approach: string;
  beyondCoding: string;
  lookingForward: string;
  metaTitle?: string;
  metaDescription?: string;
  image?: string;
};

export type IUpdateAbout = Partial<ICreateAbout>;

export type IAboutResponse = {
  id: string;
  journey: string;
  values: string;
  approach: string;
  beyondCoding: string;
  lookingForward: string;
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
