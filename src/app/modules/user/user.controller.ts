import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getProfile(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;

  const result = await UserService.updateProfile(
    req.user.userId,
    req.body,
    file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const getPublicProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserService.getPublicProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Public profile retrieved successfully',
    data: result,
  });
});

export const UserController = {
  getProfile,
  updateProfile,
  getPublicProfile,
};
