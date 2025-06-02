import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AboutService } from './about.service';

const createOrUpdateAbout = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  const result = await AboutService.createOrUpdateAbout(
    req.user?.userId,
    req.body,
    file
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
  const file = req.file as Express.Multer.File;
  const result = await AboutService.updateAbout(
    req.user?.userId,
    req.body,
    file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About section updated successfully',
    data: result,
  });
});

// Quote controllers
const createQuote = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutService.createQuote(req.user?.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Quote created successfully',
    data: result,
  });
});

const getAllQuotes = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutService.getAllQuotes(req.user?.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quotes retrieved successfully',
    data: result,
  });
});

const getRandomQuote = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutService.getRandomQuote(req.params.profileId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Random quote retrieved successfully',
    data: result,
  });
});

const updateQuote = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutService.updateQuote(
    req.user?.userId,
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quote updated successfully',
    data: result,
  });
});

const deleteQuote = catchAsync(async (req: Request, res: Response) => {
  await AboutService.deleteQuote(req.user?.userId, req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quote deleted successfully',
    data: null,
  });
});

export const AboutController = {
  createOrUpdateAbout,
  getAboutByProfile,
  updateAbout,
  createQuote,
  getAllQuotes,
  getRandomQuote,
  updateQuote,
  deleteQuote,
};
