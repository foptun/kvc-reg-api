import { Context, Next } from 'hono';

export async function logger(c, next) {
  const start = Date.now();
  const { method, path } = c.req;

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : status >= 300 ? '\x1b[36m' : '\x1b[32m';
  const reset = '\x1b[0m';

  console.log(`${statusColor}${method}${reset} ${path} ${statusColor}${status}${reset} - ${duration}ms`);
}
