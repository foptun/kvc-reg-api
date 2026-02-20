import { z } from 'zod';
import { ValidatorUtil } from '../../utils/validator.util.js';

export const loginSchema = z.object({
  email: ValidatorUtil.email,
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface LoginResponseDto {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}
