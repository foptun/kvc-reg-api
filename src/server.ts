import { serve } from '@hono/node-server';
import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    const server = serve(
      {
        fetch: app.fetch,
        port: env.PORT,
      },
      (info) => {
        console.log(`
╔════════════════════════════════════════╗
║     Registration API Server            ║
╠════════════════════════════════════════╣
║  Environment: ${env.NODE_ENV.padEnd(24)} ║
║  Port:        ${String(env.PORT).padEnd(24)} ║
║  URL:         http://localhost:${env.PORT.toString().padEnd(8)} ║
╠════════════════════════════════════════╣
║  Endpoints:                            ║
║  - Health:    /health                  ║
║  - API v1:    /api/v1                  ║
╚════════════════════════════════════════╝
        `);
      }
    );

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      // Close database connection
      await prisma.$disconnect();
      console.log('✅ Database disconnected');

      // Exit process
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
