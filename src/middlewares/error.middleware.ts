import { Context } from 'hono';
import { BaseException } from '../exceptions/base.exception.js';
import { env } from '../config/env.js';

export async function errorHandler(err: Error, c: Context) {
  console.error('[Error]:', err);

  if (err instanceof BaseException) {
    return c.json(
      {
        success: false,
        error: err.name,
        message: err.message,
        details: err.details,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
      },
      err.statusCode as any
    );
  }

  // Default error response
  return c.json(
    {
      success: false,
      error: 'InternalServerError',
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    500
  );
}
