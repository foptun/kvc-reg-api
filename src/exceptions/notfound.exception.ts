import { BaseException } from './base.exception.js';

export class NotFoundException extends BaseException {
  constructor(message = 'Resource not found', details?: unknown) {
    super(404, message, details);
  }
}
