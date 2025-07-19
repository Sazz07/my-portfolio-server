import ApiError from '../../../errors/ApiError';
import emailSender from '../../../helpers/emailSender';
import prisma from '../../../shared/prisma';
import { IContactMe } from './contact.interface';
import httpStatus from 'http-status';

const createContact = async (payload: {
  name: string;
  email: string;
  message: string;
}) => {
  // Store in DB
  const contact = await prisma.contactMe.create({
    data: {
      name: payload.name,
      email: payload.email,
      message: payload.message,
    },
  });

  // Send email notification to admin
  await emailSender(
    process.env.CONTACT_RECEIVER_EMAIL || 'sazzad.hossain882@gmail.com',
    `
      <div>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message}</p>
      </div>
    `
  );

  return contact;
};

const getAllContacts = async (): Promise<IContactMe[]> => {
  const contacts = await prisma.contactMe.findMany({
    orderBy: { createdAt: 'desc' },
  });
  // Map legacy null emails to empty string for type safety
  return contacts.map(
    (c) => ({ ...c, email: c.email === null ? '' : c.email } as IContactMe)
  );
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
