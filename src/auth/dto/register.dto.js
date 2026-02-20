import { z } from 'zod';
import { ValidatorUtil } from '../../utils/validator.util.js';

export const registerSchema = z.object({
  email: ValidatorUtil.email,
  password: ValidatorUtil.password,
  name: ValidatorUtil.name.optional(),
});
