import { Context } from 'hono';
import { UserService } from './user.service.js';
import { updateUserSchema } from './dto/user.dto.js';
import { ValidationException } from '../exceptions/validation.exception.js';
import { z } from 'zod';
import { ResponseUtil } from '../utils/response.util.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getById(c: Context) {
    const id = c.req.param('id');
    const user = await this.userService.getById(id);

    return c.json(ResponseUtil.success({ user }, 'User retrieved successfully'));
  }

  async getAll(c: Context) {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;

    const users = await this.userService.getAll(page, limit);

    return c.json(ResponseUtil.success({ users, page, limit }, 'Users retrieved successfully'));
  }

  async update(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const dto = updateUserSchema.parse(body);

      const user = await this.userService.update(id, dto);

      return c.json(ResponseUtil.success({ user }, 'User updated successfully'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationException('Validation failed', error.errors);
      }
      throw error;
    }
  }

  async delete(c: Context) {
    const id = c.req.param('id');
    const result = await this.userService.delete(id);

    return c.json(ResponseUtil.success(result, 'User deleted successfully'));
  }

  async getProfile(c: Context) {
    const currentUser = c.get('user');
    const user = await this.userService.getById(currentUser.userId);

    return c.json(ResponseUtil.success({ user }, 'Profile retrieved successfully'));
  }
}
