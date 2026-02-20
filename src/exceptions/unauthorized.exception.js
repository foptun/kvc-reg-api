import { BaseException } from './base.exception.js';

export class UnauthorizedException extends BaseException {
  constructor(message = 'Unauthorized', details) {
    super(401, message, 4010, details);
  }
}
