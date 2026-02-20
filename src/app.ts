import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoutes } from './health/health.route.js';
import { authRoutes } from './auth/auth.route.js';
import { userRoutes } from './user/user.route.js';
import { logger } from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { env } from './config/env.js';

const app = new Hono();

// Global middlewares
app.use('*', logger);
app.use(
  '*',
  cors({
    origin: env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
    credentials: true,
  })
);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Registration API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
    },
  });
});

// Health check (not versioned)
app.route('/health', healthRoutes);

// API v1 routes
const apiV1 = new Hono();
apiV1.route('/auth', authRoutes);
apiV1.route('/users', userRoutes);

app.route('/api/v1', apiV1);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: 'NotFound',
      message: 'The requested resource was not found',
      path: c.req.path,
    },
    404
  );
});

// Global error handler
app.onError(errorHandler);

export default app;
