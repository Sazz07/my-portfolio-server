import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContactService } from './contact.service';

const createContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.createContact(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Contact message sent successfully',
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getAllContacts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contacts retrieved successfully',
    data: result,
  });
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.deleteContact(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact deleted successfully',
    data: result,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  deleteContact,
};
