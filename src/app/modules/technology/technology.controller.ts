import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TechnologyService } from './technology.service';

const createTechnology = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnologyService.createTechnology(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Technology created successfully',
    data: result,
  });
});

const getAllTechnologies = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnologyService.getAllTechnologies();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Technologies retrieved successfully',
    data: result,
  });
});

const getTechnologiesByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { category } = req.params;
    const result = await TechnologyService.getTechnologiesByCategory(category);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Technologies retrieved successfully',
      data: result,
    });
  }
);

const getAllTechnologyCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TechnologyService.getAllTechnologyCategories();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Technology categories retrieved successfully',
      data: result,
    });
  }
);

const seedTechnologies = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnologyService.seedTechnologies();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Technologies seeded successfully',
    data: result,
  });
});

export const TechnologyController = {
  createTechnology,
  getAllTechnologies,
  getTechnologiesByCategory,
  getAllTechnologyCategories,
  seedTechnologies,
};
