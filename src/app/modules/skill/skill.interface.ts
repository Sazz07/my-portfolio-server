export type ICreateSkill = {
  name: string;
  proficiency: number;
};

export type IUpdateSkill = Partial<ICreateSkill>;