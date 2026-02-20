import { JwtUtil } from '../utils/jwt.util.js';
import { UnauthorizedException } from '../exceptions/unauthorized.exception.js';
import { ForbiddenException } from '../exceptions/forbidden.exception.js';

export async function authMiddleware(c, next) {
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
    throw new UnauthorizedException(error.message);
  }
}

// Optional: Role-based authorization middleware
export function requireRole(...roles) {
  return async (c, next) => {
    const user = c.get('user');

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(`Requires one of these roles: ${roles.join(', ')}`);
    }

    await next();
  };
}
