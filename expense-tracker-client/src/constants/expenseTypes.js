// Mirrors App\Enums\ExpenseType on the backend (travel | food | other).
// Kept as a single constant so the <select> options and the badge colours
// used in the table can never drift out of sync with each other.
export const EXPENSE_TYPES = [
  { value: 'travel', label: 'Travel', badgeClass: 'bg-blue-100 text-blue-800' },
  { value: 'food', label: 'Food', badgeClass: 'bg-amber-100 text-amber-800' },
  { value: 'other', label: 'Other', badgeClass: 'bg-slate-200 text-slate-800' },
];

const EXPENSE_TYPES_BY_VALUE = Object.fromEntries(EXPENSE_TYPES.map((t) => [t.value, t]));

export function labelForType(value) {
  return EXPENSE_TYPES_BY_VALUE[value]?.label ?? value;
}

export function badgeClassForType(value) {
  return EXPENSE_TYPES_BY_VALUE[value]?.badgeClass ?? 'bg-slate-200 text-slate-800';
}
