export class DateFormatter {
  private static readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  private static readonly dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  /**
   * Parses an ISO 8601 date string and returns a Date object.
   * @param dateString ISO 8601 date string (e.g., "2024-09-27T15:30:00")
   * @returns Date object
   */
  private static parseISOString(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Formats a date according to the specified format string.
   * @param dateString ISO 8601 date string (e.g., "2024-09-27T15:30:00")
   * @param format The format string (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY', 'MMMM D, YYYY')
   * @returns The formatted date string
   */
  public static format(dateString: string, format: string): string {
    const date = this.parseISOString(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return format.replace(/Y+|M+|D+|d+|H+|m+/g, match => {
      switch (match) {
        case 'YYYY': return year.toString();
        case 'YY': return year.toString().slice(-2);
        case 'MMMM': return this.monthNames[month];
        case 'MMM': return this.monthNames[month].slice(0, 3);
        case 'MM': return (month + 1).toString().padStart(2, '0');
        case 'M': return (month + 1).toString();
        case 'DD': return day.toString().padStart(2, '0');
        case 'D': return day.toString();
        case 'dddd': return this.dayNames[dayOfWeek];
        case 'ddd': return this.dayNames[dayOfWeek].slice(0, 3);
        case 'HH': return hours.toString().padStart(2, '0');
        case 'H': return hours.toString();
        case 'mm': return minutes.toString().padStart(2, '0');
        case 'm': return minutes.toString();
        default: return match;
      }
    });
  }

  /**
   * Formats a date to show just the date part.
   * @param dateString ISO 8601 date string (e.g., "2024-09-27T15:30:00")
   * @returns A string in the format "YYYY-MM-DD"
   */
  public static formatDateOnly(dateString: string): string {
    return this.format(dateString, 'YYYY-MM-DD');
  }

  /**
   * Formats a date to show a human-readable date.
   * @param dateString ISO 8601 date string (e.g., "2024-09-27T15:30:00")
   * @returns A string in the format "Month D, YYYY" (e.g., "September 27, 2024")
   */
  public static formatReadableDate(dateString: string): string {
    return this.format(dateString, 'MMMM D, YYYY');
  }

  /**
   * Formats a date to show both date and time.
   * @param dateString ISO 8601 date string (e.g., "2024-09-27T15:30:00")
   * @returns A string in the format "YYYY-MM-DD HH:mm"
   */
  public static formatDateTime(dateString: string): string {
    return this.format(dateString, 'YYYY-MM-DD HH:mm');
  }
}