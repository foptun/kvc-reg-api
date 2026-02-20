import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export class JwtUtil {
  static generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: 'reg-api',
      audience: 'reg-api-client',
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'reg-api',
      audience: 'reg-api-client',
    });
  }

  static verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET, {
        issuer: 'reg-api',
        audience: 'reg-api-client',
      });
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  static verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
        issuer: 'reg-api',
        audience: 'reg-api-client',
      });
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }
}
