export type ICreateSkill = {
  name: string;
  proficiency: number;
  categoryId: string;
};

export type IUpdateSkill = Partial<ICreateSkill>;

export type ISkillCategory = {
  id: string;
  name: string;
};
