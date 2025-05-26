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

const getSingleTechnology = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnologyService.getSingleTechnology(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Technology retrieved successfully',
    data: result,
  });
});

const updateTechnology = catchAsync(async (req: Request, res: Response) => {
  const result = await TechnologyService.updateTechnology(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Technology updated successfully',
    data: result,
  });
});

const deleteTechnology = catchAsync(async (req: Request, res: Response) => {
  await TechnologyService.deleteTechnology(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Technology deleted successfully',
  });
});

export const TechnologyController = {
  createTechnology,
  getAllTechnologies,
  getSingleTechnology,
  updateTechnology,
  deleteTechnology,
};
