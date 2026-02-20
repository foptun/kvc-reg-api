export class DateUtil {
  static getThaiTimestamp(date: Date = new Date()): string {
    // Returns ISO string format but in Asia/Bangkok timezone
    const offset = 7 * 60; // Bangkok is UTC+7
    const localTime = new Date(date.getTime() + offset * 60 * 1000);
    return localTime.toISOString().replace('Z', '+07:00');
  }

  static getFormattedThaiDate(date: Date = new Date()): string {
    return date.toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
