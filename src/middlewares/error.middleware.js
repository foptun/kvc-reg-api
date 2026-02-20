import { BaseException } from '../exceptions/base.exception.js';
import { env } from '../config/env.js';
import { ResponseUtil } from '../utils/response.util.js';

export async function errorHandler(err, c) {
  console.error('[Error]:', err);

  if (err instanceof BaseException) {
    return c.json(
      ResponseUtil.fail(
        err.message,
        err.errorCode,
        env.NODE_ENV === 'development' ? { error: err.name, details: err.details, stack: err.stack } : err.details
      ),
      err.statusCode
    );
  }

  // Default error response
  return c.json(
    ResponseUtil.fail(
      env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      5000,
      env.NODE_ENV === 'development' ? { error: 'InternalServerError', stack: err.stack } : null
    ),
    500
  );
}
