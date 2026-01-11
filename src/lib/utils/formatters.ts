/**
 * Format a date string or timestamp to a readable format
 */
export function formatDate(date: string | number | Date): string {
  const d = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Truncate a string (like wallet address) with ellipsis
 */
export function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
