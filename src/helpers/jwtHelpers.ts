import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export interface IJwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

const createToken = (
  payload: IJwtPayload,
  secret: Secret,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  } as SignOptions);
};

const verifyToken = (token: string, secret: Secret): IJwtPayload => {
  return jwt.verify(token, secret) as IJwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
