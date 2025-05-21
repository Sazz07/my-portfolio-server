import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IGenericErrorResponse } from '../interfaces/common';

const handlePrismaError = (
  error: PrismaClientKnownRequestError
): IGenericErrorResponse => {
  let statusCode = 400;
  let message = 'Database error';
  let errorMessages = [
    {
      path: '',
      message: '',
    },
  ];

  if (error.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate entry';
    const target = (error.meta?.target as string[]) || [];
    errorMessages = [
      {
        path: target[0] || '',
        message: `${target[0]} already exists`,
      },
    ];
  } else if (error.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else if (error.code === 'P2003') {
    statusCode = 400;
    message = 'Foreign key constraint failed';
    const target = (error.meta?.field_name as string) || '';
    errorMessages = [
      {
        path: target,
        message: `Invalid ${target}`,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handlePrismaError;
