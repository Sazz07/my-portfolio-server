import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContactService } from './contact.service';
import pick from '../../../shared/pick';

const createContact = catchAsync(async (req: Request, res: Response) => {
  const { profileId } = req.params;
  const result = await ContactService.createContact(profileId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Contact created successfully',
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await ContactService.getAllContacts(req.user.userId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contacts retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getSingleContact(
    req.params.id,
    req.user.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact retrieved successfully',
    data: result,
  });
});

const updateContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.updateContact(
    req.params.id,
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  });
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
  await ContactService.deleteContact(req.params.id, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact deleted successfully',
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContact,
  deleteContact,
};
