import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/common';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const statusCode = 400;

  const errorMessages = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages,
  };
};

export default handleZodError;
