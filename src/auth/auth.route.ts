import { Hono } from 'hono';
import { AuthController } from './auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authController = new AuthController();

export const authRoutes = new Hono()
  .post('/login', (c) => authController.login(c))
  .post('/register', (c) => authController.register(c))
  .post('/refresh', (c) => authController.refreshToken(c))
  .get('/me', authMiddleware, (c) => authController.me(c));
