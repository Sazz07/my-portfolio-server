import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const registerZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
    firstName: z.string({
      required_error: 'First name is required',
    }),
    lastName: z.string().optional(),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  registerZodSchema,
  changePasswordZodSchema,
  refreshTokenZodSchema,
};
