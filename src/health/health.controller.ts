import { Context } from 'hono';
import { prisma } from '../config/database.js';
import { ResponseUtil } from '../utils/response.util.js';
import { DateUtil } from '../utils/date.util';

export class HealthController {
  async check(c: Context) {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      return c.json(
        ResponseUtil.success(
          {
            status: 'UP',
            uptime: process.uptime(),
            database: 'connected',
            timestamp: DateUtil.getThaiTimestamp(),
          },
          'Health check passed'
        )
      );
    } catch (error) {
      return c.json(
        ResponseUtil.fail('Health check failed', 5003, {
          status: 'unhealthy',
          uptime: process.uptime(),
          database: 'disconnected',
          error: (error as Error).message,
          timestamp: DateUtil.getThaiTimestamp(),
        }),
        503
      );
    }
  }

  async ping(c: Context) {
    return c.json(
      ResponseUtil.success(
        null,
        'pong'
      )
    );
  }
}
