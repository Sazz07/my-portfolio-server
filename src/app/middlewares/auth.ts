import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { UserRole } from '@prisma/client';
import ApiError from '../../errors/ApiError';

// Define the JwtPayload interface
interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

const auth = (...requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid or missing authorization header'
        );
      }

      const token = bearerToken.split(' ')[1];
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token format');
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as Secret
      ) as JwtPayload;

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      next(error);
    }
  };
};

export default auth;
