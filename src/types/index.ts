import { JwtPayload } from '../utils/jwt.util.js';

declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload;
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
