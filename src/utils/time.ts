// Time and date utilities
export function formatTime(timestamp: number, timezoneOffset?: number): string {
  const date = new Date(timestamp * 1000);

  if (timezoneOffset !== undefined) {
    // Adjust for timezone offset
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezoneOffset * 1000);
    return localTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(
  timestamp: number,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatDateTime(
  timestamp: number,
  timezoneOffset?: number,
): string {
  const date = new Date(timestamp * 1000);

  if (timezoneOffset !== undefined) {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezoneOffset * 1000);
    return localTime.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1 * 1000);
  const date2 = new Date(timestamp2 * 1000);
  return date1.toDateString() === date2.toDateString();
}
