import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { EducationService } from './education.service';

const createEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationService.createEducation(
    req.user?.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Education created successfully',
    data: result,
  });
});

const getAllEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationService.getAllEducation();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Education retrieved successfully',
    data: result,
  });
});

const getEducationByProfile = catchAsync(
  async (req: Request, res: Response) => {
    const result = await EducationService.getEducationByProfile(
      req.params.profileId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Education retrieved successfully',
      data: result,
    });
  }
);

const getSingleEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationService.getSingleEducation(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Education retrieved successfully',
    data: result,
  });
});

const updateEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationService.updateEducation(
    req.params.id,
    req.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Education updated successfully',
    data: result,
  });
});

const deleteEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationService.deleteEducation(
    req.params.id,
    req.user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Education deleted successfully',
    data: result,
  });
});

export const EducationController = {
  createEducation,
  getAllEducation,
  getEducationByProfile,
  getSingleEducation,
  updateEducation,
  deleteEducation,
};
