const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

export function formatCurrency(amount) {
  return currencyFormatter.format(Number(amount) || 0);
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDate(isoDate) {
  if (!isoDate) return '';
  // Append a time so the string is parsed as local, avoiding the classic
  // "date is one day off" bug caused by parsing a bare YYYY-MM-DD as UTC.
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`));
}

/** Extract a flat, human-readable list of messages from a Laravel 422 error payload. */
export function extractValidationErrors(error) {
  const errors = error?.response?.data?.errors;
  if (!errors) return [];
  return Object.values(errors).flat();
}

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return (
    error?.response?.data?.message ||
    extractValidationErrors(error)[0] ||
    fallback
  );
}
