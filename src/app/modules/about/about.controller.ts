import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AboutService } from './about.service';

const createOrUpdateAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutService.createOrUpdateAbout(
    req.user?.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About section created/updated successfully',
    data: result,
  });
});

const getAboutByProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutService.getAboutByProfile(req.params.profileId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About section retrieved successfully',
    data: result,
  });
});

const updateAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutService.updateAbout(req.user?.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About section updated successfully',
    data: result,
  });
});

export const AboutController = {
  createOrUpdateAbout,
  getAboutByProfile,
  updateAbout,
};
