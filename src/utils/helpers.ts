/**
 * Generate a URL-friendly slug from a string.
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Safely convert any date representation (Firestore Timestamp, Date, string, number, or object with seconds) to a JS Date.
 */
export const toDateObject = (date: any): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
  if (typeof date.toDate === 'function') {
    try {
      const d = date.toDate();
      if (d instanceof Date && !isNaN(d.getTime())) return d;
    } catch {}
  }
  if (typeof date === 'object' && typeof date.seconds === 'number') {
    return new Date(date.seconds * 1000);
  }
  if (typeof date === 'number' || typeof date === 'string') {
    const d = new Date(date);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

/**
 * Format a Firestore Timestamp, Date, string, or number to a readable date string.
 */
export const formatDate = (
  date: any,
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = toDateObject(date);
  if (!d) return '';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  });
};

/**
 * Format a date as "DD.MM.YYYY" for editorial use.
 */
export const formatEditorialDate = (date: any): string => {
  const d = toDateObject(date);
  if (!d) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Format price with currency symbol.
 */
export const formatPrice = (price: number, currency: string = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Truncate text to a max length, adding ellipsis.
 */
export const truncate = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '…';
};

/**
 * Pad a number with leading zeros (e.g., 1 -> "01").
 */
export const padNumber = (num: number, digits: number = 2): string =>
  String(num).padStart(digits, '0');

/**
 * Generate an array of years from start to current.
 */
export const getYearRange = (startYear: number = 2018): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= startYear; y--) {
    years.push(y);
  }
  return years;
};
