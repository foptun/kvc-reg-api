import { prisma } from '../config/database.js';
import { ResponseUtil } from '../utils/response.util.js';
import { DateUtil } from '../utils/date.util.js';

export class HealthController {
  async check(c) {
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
          error: error.message,
          timestamp: DateUtil.getThaiTimestamp(),
        }),
        503
      );
    }
  }

  async ping(c) {
    return c.json(
      ResponseUtil.success(
        null,
        'pong'
      )
    );
  }
}
