import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProjectService } from './project.service';
import pick from '../../../shared/pick';

const createProject = catchAsync(async (req: Request, res: Response) => {
  if (req.body.technologies && typeof req.body.technologies === 'string') {
    try {
      req.body.technologies = JSON.parse(req.body.technologies);
    } catch (error) {
      if (!Array.isArray(req.body.technologies)) {
        req.body.technologies = [req.body.technologies];
      }
    }
  }

  const result = await ProjectService.createProject(
    req.user.userId,
    req.body,
    req.file as any
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Project created successfully',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'status']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await ProjectService.getAllProjects(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getSingleProject(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project retrieved successfully',
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  // Parse technologies if it's a JSON string
  if (req.body.technologies && typeof req.body.technologies === 'string') {
    try {
      req.body.technologies = JSON.parse(req.body.technologies);
    } catch (error) {
      // If parsing fails, keep it as is (might be a single technology)
      if (!Array.isArray(req.body.technologies)) {
        req.body.technologies = [req.body.technologies];
      }
    }
  }

  const result = await ProjectService.updateProject(
    req.params.id,
    req.user.userId,
    req.body,
    req.file as any
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project updated successfully',
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  await ProjectService.deleteProject(req.params.id, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project deleted successfully',
  });
});

export const ProjectController = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};
