import { BaseException } from './base.exception.js';

export class NotFoundException extends BaseException {
  constructor(message = 'Resource not found', details) {
    super(404, message, 4040, details);
  }
}
