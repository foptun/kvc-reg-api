import { z } from 'zod';
import { ValidatorUtil } from '../../utils/validator.util.js';

export const updateUserSchema = z.object({
  name: ValidatorUtil.name.optional(),
  role: ValidatorUtil.role.optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export interface UserResponseDto {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
