export type ILoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
