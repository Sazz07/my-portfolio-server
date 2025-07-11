import ApiError from '../../../errors/ApiError';
import emailSender from '../../../helpers/emailSender';
import prisma from '../../../shared/prisma';
import { IContactMe } from './contact.interface';
import httpStatus from 'http-status';

const createContact = async (
  payload: Omit<IContactMe, 'id' | 'createdAt' | 'updatedAt'>
) => {
  // Store in DB
  const contact = await prisma.contactMe.create({
    data: payload,
  });

  // Send email notification to admin
  await emailSender(
    process.env.CONTACT_RECEIVER_EMAIL || 'sazzad.hossain882@gmail.com',
    `
      <div>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Subject:</strong> ${payload.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message}</p>
      </div>
    `
  );

  return contact;
};

const getAllContacts = async (): Promise<IContactMe[]> => {
  return prisma.contactMe.findMany({ orderBy: { createdAt: 'desc' } });
};

const deleteContact = async (id: string) => {
  const contact = await prisma.contactMe.findUnique({ where: { id } });
  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }
  return prisma.contactMe.delete({ where: { id } });
};

export const ContactService = {
  createContact,
  getAllContacts,
  deleteContact,
};
