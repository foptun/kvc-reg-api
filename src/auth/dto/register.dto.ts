import { z } from 'zod';
import { ValidatorUtil } from '../../utils/validator.util.js';

export const registerSchema = z.object({
  email: ValidatorUtil.email,
  password: ValidatorUtil.password,
  name: ValidatorUtil.name.optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export interface RegisterResponseDto {
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
