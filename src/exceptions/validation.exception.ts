import { BaseException } from './base.exception.js';

export class ValidationException extends BaseException {
  constructor(message = 'Validation failed', details?: unknown) {
    super(400, message, details);
  }
}
