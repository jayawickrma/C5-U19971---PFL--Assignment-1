import { describe, expect, it } from 'vitest';
import { extractErrorMessage, extractValidationErrors, formatCurrency, formatDate } from '../format.js';

describe('formatCurrency', () => {
  it('formats numbers as GBP with two decimal places', () => {
    expect(formatCurrency(12.5)).toBe('£12.50');
    expect(formatCurrency(0)).toBe('£0.00');
  });

  it('falls back to 0 for non-numeric input', () => {
    expect(formatCurrency(undefined)).toBe('£0.00');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string in a readable, unambiguous form', () => {
    expect(formatDate('2026-03-04')).toBe('04 Mar 2026');
  });

  it('returns an empty string for a falsy input', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('extractValidationErrors', () => {
  it('flattens a Laravel 422 errors object into a single array of messages', () => {
    const error = {
      response: { data: { errors: { email: ['Required'], password: ['Too short', 'Required'] } } },
    };
    expect(extractValidationErrors(error)).toEqual(['Required', 'Too short', 'Required']);
  });

  it('returns an empty array when there is no errors object', () => {
    expect(extractValidationErrors({ response: { data: {} } })).toEqual([]);
  });
});

describe('extractErrorMessage', () => {
  it('prefers the top-level message field', () => {
    const error = { response: { data: { message: 'Unauthenticated.' } } };
    expect(extractErrorMessage(error)).toBe('Unauthenticated.');
  });

  it('falls back to the first validation error', () => {
    const error = { response: { data: { errors: { email: ['The email field is required.'] } } } };
    expect(extractErrorMessage(error)).toBe('The email field is required.');
  });

  it('falls back to the provided default when nothing else is available', () => {
    expect(extractErrorMessage({}, 'Default message')).toBe('Default message');
  });
});
