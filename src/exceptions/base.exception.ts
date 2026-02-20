export class BaseException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly errorCode: number = 1000,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      details: this.details,
    };
  }
}
