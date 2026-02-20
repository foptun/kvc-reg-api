import { Context, Next } from 'hono';
import { JwtUtil } from '../utils/jwt.util.js';
import { UnauthorizedException } from '../exceptions/unauthorized.exception.js';

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authorization = c.req.header('Authorization');

    if (!authorization) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format. Use: Bearer <token>');
    }

    const payload = JwtUtil.verifyAccessToken(token);

    // Store user info in context
    c.set('user', payload);

    await next();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new UnauthorizedException((error as Error).message);
  }
}

// Optional: Role-based authorization middleware
export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!roles.includes(user.role)) {
      throw new UnauthorizedException(`Requires one of these roles: ${roles.join(', ')}`);
    }

    await next();
  };
}
