import { DateUtil } from './date.util.js';

export class ResponseUtil {
  static success(data, message = 'Successfully', code = 0) {
    return {
      status: 'SUCCESS',
      code,
      message,
      timestamp: DateUtil.getThaiTimestamp(),
      data,
    };
  }

  static fail(message, code, data = null) {
    return {
      status: 'FAIL',
      code,
      message,
      timestamp: DateUtil.getThaiTimestamp(),
      data,
    };
  }
}
