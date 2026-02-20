export interface ApiResponse<T = any> {
  status: 'SUCCESS' | 'FAIL';
  code: number;
  message: string;
  data: T | null;
}

export class ResponseUtil {
  static success<T>(data: T, message: string = 'Successfully', code: number = 0): ApiResponse<T> {
    return {
      status: 'SUCCESS',
      code,
      message,
      data,
    };
  }

  static fail<T>(message: string, code: number, data: T | null = null): ApiResponse<T> {
    return {
      status: 'FAIL',
      code,
      message,
      data,
    };
  }
}
