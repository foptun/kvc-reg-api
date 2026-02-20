import { Hono } from 'hono';
import { UserController } from './user.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const userController = new UserController();

export const userRoutes = new Hono()
  .get('/profile', authMiddleware, (c) => userController.getProfile(c))
  .get('/', authMiddleware, requireRole('admin'), (c) => userController.getAll(c))
  .get('/:id', authMiddleware, requireRole('admin'), (c) => userController.getById(c))
  .patch('/:id', authMiddleware, requireRole('admin'), (c) => userController.update(c))
  .delete('/:id', authMiddleware, requireRole('admin'), (c) => userController.delete(c));
