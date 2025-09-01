export enum DateFormat {
  READABLE = "readable", // "Thursday, August 21, 2025"
  DATETIME = "datetime", // "21/08/2025, 3:30:45 pm"
  SHORT = "short", // "21/08/2025"
}

export interface DateOptions {
  format?: DateFormat;
  date?: Date;
}

/**
 * Formats a date according to Nigerian standards
 * @param options - Configuration options for date formatting
 * @param options.date - The date to format (defaults to current date)
 * @param options.format - The format type (defaults to READABLE)
 * @returns Formatted date string
 */
export function formatNigerianDate(options: DateOptions = {}): string {
  const {date = new Date(), format = DateFormat.READABLE} = options;

  const timeZone = "Africa/Lagos";

  switch (format) {
    case DateFormat.READABLE:
      return new Intl.DateTimeFormat("en-NG", {
        timeZone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);

    case DateFormat.DATETIME:
      return new Intl.DateTimeFormat("en-NG", {
        timeZone,
        dateStyle: "short",
        timeStyle: "medium",
      }).format(date);

    case DateFormat.SHORT:
      return new Intl.DateTimeFormat("en-NG", {
        timeZone,
        dateStyle: "short",
      }).format(date);

    default:
      return new Intl.DateTimeFormat("en-NG", {
        timeZone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
  }
}

// Convenience functions for each format
export function readableDate(date?: Date): string {
  return formatNigerianDate({date, format: DateFormat.READABLE});
}

export function dateTime(date?: Date): string {
  return formatNigerianDate({date, format: DateFormat.DATETIME});
}

export function shortDate(date?: Date): string {
  return formatNigerianDate({date, format: DateFormat.SHORT});
}

// Usage Examples:
/*
// Using the main function
console.log(formatNigerianDate()); // "Thursday, August 21, 2025" (current date, default format)
console.log(formatNigerianDate({ format: DateFormat.SHORT })); // "21/08/2025"
console.log(formatNigerianDate({ date: new Date('2024-12-25'), format: DateFormat.DATETIME })); // "25/12/2024, 12:00:00 am"

// Using convenience functions
console.log(readableDate()); // "Thursday, August 21, 2025"
console.log(dateTime()); // "21/08/2025, 3:30:45 pm"
console.log(shortDate()); // "21/08/2025"

// With custom dates
const customDate = new Date('2024-12-25T15:30:00');
console.log(readableDate(customDate)); // "Wednesday, December 25, 2024"
console.log(dateTime(customDate)); // "25/12/2024, 3:30:00 pm"
console.log(shortDate(customDate)); // "25/12/2024"
*/
