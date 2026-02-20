import { BaseException } from './base.exception.js';

export class ConflictException extends BaseException {
  constructor(message = 'Resource conflict', details) {
    super(409, message, 4090, details);
  }
}
