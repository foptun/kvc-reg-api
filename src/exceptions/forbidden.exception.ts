import { BaseException } from './base.exception.js';

export class ForbiddenException extends BaseException {
  constructor(message = 'Forbidden', details?: unknown) {
    super(403, message, 4030, details);
  }
}
