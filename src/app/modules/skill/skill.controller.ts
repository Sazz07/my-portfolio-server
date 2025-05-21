import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SkillService } from './skill.service';

const createSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillService.createSkill(req.user.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Skill created successfully',
    data: result,
  });
});

const getAllSkills = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillService.getAllSkills();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skills retrieved successfully',
    data: result,
  });
});

const getSkillsByProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillService.getSkillsByProfile(req.params.profileId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skills retrieved successfully',
    data: result,
  });
});

const getSingleSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillService.getSingleSkill(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill retrieved successfully',
    data: result,
  });
});

const updateSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillService.updateSkill(
    req.params.id,
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill updated successfully',
    data: result,
  });
});

const deleteSkill = catchAsync(async (req: Request, res: Response) => {
  await SkillService.deleteSkill(req.params.id, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill deleted successfully',
  });
});

export const SkillController = {
  createSkill,
  getAllSkills,
  getSkillsByProfile,
  getSingleSkill,
  updateSkill,
  deleteSkill,
};
