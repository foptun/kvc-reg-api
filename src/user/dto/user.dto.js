import { z } from 'zod';
import { ValidatorUtil } from '../../utils/validator.util.js';

export const updateUserSchema = z.object({
  name: ValidatorUtil.name.optional(),
  role: ValidatorUtil.role.optional(),
  isActive: z.boolean().optional(),
});
