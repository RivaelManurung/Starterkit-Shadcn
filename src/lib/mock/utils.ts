import { format } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Generate a random alphanumeric ID
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Convert a string into a URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-')        // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Format a date string into a localized Indonesian format
 */
export function formatDate(date: string | Date, formatStr: string = 'dd MMM yyyy'): string {
  return format(new Date(date), formatStr, { locale: id });
}

/**
 * Export data array to a JSON file
 */
export function exportToJSON<T>(data: T[], filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export data array to a CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) return;

  const header = columns.map(col => col.label).join(',');
  const rows = data.map(item => {
    return columns.map(col => {
      let value: any = item[col.key];
      // Escape strings containing commas, quotes, or newlines
      if (typeof value === 'string') {
        value = `"${value.replace(/"/g, '""')}"`;
      } else if (Array.isArray(value)) {
        value = `"${value.join(', ')}"`;
      }
      return value as string;
    }).join(',');
  });

  const csvContent = [header, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
