import { Context } from 'hono';
import { prisma } from '../config/database.js';
import { ResponseUtil } from '../utils/response.util.js';

export class HealthController {
  async check(c: Context) {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      return c.json(
        ResponseUtil.success(
          {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected',
          },
          'Health check passed'
        )
      );
    } catch (error) {
      return c.json(
        ResponseUtil.fail('Health check failed', 5003, {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          database: 'disconnected',
          error: (error as Error).message,
        }),
        503
      );
    }
  }

  async ping(c: Context) {
    return c.json(
      ResponseUtil.success(
        {
          timestamp: new Date().toISOString(),
        },
        'pong'
      )
    );
  }
}
