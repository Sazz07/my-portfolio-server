export type ICreateContact = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type IUpdateContact = Partial<ICreateContact>;
