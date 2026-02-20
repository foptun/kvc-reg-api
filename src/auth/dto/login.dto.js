import { z } from 'zod';
import { ValidatorUtil } from '../../utils/validator.util.js';

export const loginSchema = z.object({
  email: ValidatorUtil.email,
  password: z.string().min(1, 'Password is required'),
});
