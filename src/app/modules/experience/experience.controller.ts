import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ExperienceService } from './experience.service';

const createExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceService.createExperience(
    req.user?.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Experience created successfully',
    data: result,
  });
});

const getAllExperiences = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceService.getAllExperiences();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Experiences retrieved successfully',
    data: result,
  });
});

const getExperiencesByProfile = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ExperienceService.getExperiencesByProfile(
      req.params.profileId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Experiences retrieved successfully',
      data: result,
    });
  }
);

const getSingleExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceService.getSingleExperience(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Experience retrieved successfully',
    data: result,
  });
});

const updateExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceService.updateExperience(
    req.params.id,
    req.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Experience updated successfully',
    data: result,
  });
});

const deleteExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceService.deleteExperience(
    req.params.id,
    req.user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Experience deleted successfully',
    data: result,
  });
});

export const ExperienceController = {
  createExperience,
  getAllExperiences,
  getExperiencesByProfile,
  getSingleExperience,
  updateExperience,
  deleteExperience,
};
