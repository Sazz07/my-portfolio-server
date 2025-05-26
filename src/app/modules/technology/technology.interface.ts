export type ICreateTechnology = {
  name: string;
  value: string;
};

export type IUpdateTechnology = Partial<ICreateTechnology>;
