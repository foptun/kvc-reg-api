import { Context } from 'hono';
import { AuthService } from './auth.service.js';
import { loginSchema } from './dto/login.dto.js';
import { registerSchema } from './dto/register.dto.js';
import { ValidationException } from '../exceptions/validation.exception.js';
import { z } from 'zod';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(c: Context) {
    try {
      const body = await c.req.json();
      const dto = loginSchema.parse(body);

      const result = await this.authService.login(dto);

      return c.json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationException('Validation failed', error.errors);
      }
      throw error;
    }
  }

  async register(c: Context) {
    try {
      const body = await c.req.json();
      const dto = registerSchema.parse(body);

      const result = await this.authService.register(dto);

      return c.json(
        {
          success: true,
          data: result,
          message: 'Registration successful',
        },
        201
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationException('Validation failed', error.errors);
      }
      throw error;
    }
  }

  async refreshToken(c: Context) {
    try {
      const body = await c.req.json();
      const refreshToken = body.refreshToken;

      if (!refreshToken) {
        throw new ValidationException('Refresh token is required');
      }

      const result = await this.authService.refreshToken(refreshToken);

      return c.json({
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  async me(c: Context) {
    const user = c.get('user');

    return c.json({
      success: true,
      data: { user },
      message: 'User retrieved successfully',
    });
  }
}
