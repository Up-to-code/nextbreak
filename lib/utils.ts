import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// lib/utils.ts

/**
 * Formats a date string or Date object into a readable format
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "January 15, 2023")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'SAR')
 * @param locale - Locale code (default: 'en-US')
 * @returns Formatted currency string (e.g., "SAR 99.99")
 */
export function formatCurrency(
  amount: number,
  currency: string = 'SAR',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date with time for detailed views
 * @param date - Date object or ISO string
 * @returns Formatted date with time (e.g., "January 15, 2023 at 3:30 PM")
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

/**
 * Formats a number as compact currency (e.g., 1.5K instead of 1,500)
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'SAR')
 * @returns Formatted compact currency string (e.g., "SAR 1.5K")
 */
export function formatCompactCurrency(
  amount: number,
  currency: string = 'SAR'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
}


// lib/utils.ts
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}..`;
}