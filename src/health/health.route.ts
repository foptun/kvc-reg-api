import { Hono } from 'hono';
import { HealthController } from './health.controller.js';

const healthController = new HealthController();

export const healthRoutes = new Hono()
  .get('/', (c) => healthController.check(c))
  .get('/ping', (c) => healthController.ping(c));
