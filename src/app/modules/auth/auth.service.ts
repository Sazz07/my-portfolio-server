import { Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IChangePassword } from './auth.interface';
import { User } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

const registerUser = async (payload: {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}): Promise<Partial<User>> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: payload.firstName,
            lastName: payload.lastName,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return user;
  });

  return result;
};

const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<{
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string };
}> => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { id, role } = user;
  const accessToken = jwtHelpers.createToken(
    { userId: id, role, email },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role, email },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id,
      email,
      role,
    },
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  const { email } = verifiedToken;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: user.id,
      role: user.role,
      email: user.email,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  userId: string,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
};
