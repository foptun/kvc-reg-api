import { z } from 'zod';

export class ValidatorUtil {
  static email = z.string().email('Invalid email format');

  static password = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

  static uuid = z.string().uuid('Invalid UUID format');

  static name = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long');

  static role = z.enum(['user', 'admin', 'moderator']);

  static isEmail(value) {
    return this.email.safeParse(value).success;
  }

  static isUuid(value) {
    return this.uuid.safeParse(value).success;
  }

  static validate(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      errors: result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`),
    };
  }
}
