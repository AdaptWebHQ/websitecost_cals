import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FirestoreTimestamp } from '@/types';

// ============================================================================
// Tailwind Utility
// ============================================================================

/** Merge Tailwind CSS classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Currency & Number Formatting
// ============================================================================

/** Format a number as Indian currency (₹1,23,456) */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

/** Format number with Indian comma grouping */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

/** Calculate percentage of a value relative to a total */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// ============================================================================
// Date & Time Formatting
// ============================================================================

/** Convert Firestore timestamp or Date to a JS Date, returns null if invalid */
export function toDate(
  timestamp: FirestoreTimestamp | Date | null | undefined
): Date | null {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000);
  }
  return null;
}

/** Format date to "Jan 15, 2026" */
export function formatDate(
  date: Date | FirestoreTimestamp | null | undefined
): string {
  const d = toDate(date as FirestoreTimestamp | Date | null);
  if (!d) return 'N/A';
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format date with time: "Jan 15, 2026, 02:30 PM" */
export function formatDateTime(
  date: Date | FirestoreTimestamp | null | undefined
): string {
  const d = toDate(date as FirestoreTimestamp | Date | null);
  if (!d) return 'N/A';
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format relative time: "Just now", "5m ago", "3h ago", "2d ago" */
export function formatRelativeTime(
  date: Date | FirestoreTimestamp
): string {
  const d = toDate(date as FirestoreTimestamp | Date);
  if (!d) return 'N/A';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

// ============================================================================
// String Utilities
// ============================================================================

/** Generate URL-safe slug from text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/** Capitalize first letter of a string */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Get initials from a full name (e.g., "John Doe" → "JD") */
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// ============================================================================
// ID & Session Generators
// ============================================================================

/** Generate a random session ID for calculator sessions */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// Validation Helpers
// ============================================================================

/** Check if a value is empty (null, undefined, empty string, empty array/object) */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// ============================================================================
// Async Utilities
// ============================================================================

/** Promise-based delay for animations or rate limiting */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
