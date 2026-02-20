import { Context } from 'hono';
import { prisma } from '../config/database.js';

export class HealthController {
  async check(c: Context) {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      return c.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          database: 'disconnected',
          error: (error as Error).message,
        },
        503
      );
    }
  }

  async ping(c: Context) {
    return c.json({
      success: true,
      message: 'pong',
      timestamp: new Date().toISOString(),
    });
  }
}
