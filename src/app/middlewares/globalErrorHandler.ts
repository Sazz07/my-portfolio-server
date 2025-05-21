import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import config from '../../config';

import handleZodError from '../../errors/handleZodError';
import handlePrismaError from '../../errors/handlePrismaError';
import ApiError from '../../errors/ApiError';
import { IErrorMessage } from '../../interfaces/common';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IErrorMessage[] = [];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: '',
            message: error.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: '',
            message: error.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env === 'development' ? error.stack : undefined,
  });
};

export default globalErrorHandler;
