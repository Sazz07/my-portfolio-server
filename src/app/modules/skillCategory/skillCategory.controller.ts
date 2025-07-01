import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SkillCategoryService } from './skillCategory.service';

const createSkillCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillCategoryService.createSkillCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllSkillCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SkillCategoryService.getAllSkillCategories();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Categories retrieved successfully',
      data: result,
    });
  }
);

const getSingleSkillCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SkillCategoryService.getSingleSkillCategory(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    });
  }
);

const updateSkillCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillCategoryService.updateSkillCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteSkillCategory = catchAsync(async (req: Request, res: Response) => {
  await SkillCategoryService.deleteSkillCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully',
  });
});

export const SkillCategoryController = {
  createSkillCategory,
  getAllSkillCategories,
  getSingleSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
};
