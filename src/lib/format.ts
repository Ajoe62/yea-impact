const dateTime = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
const dateOnly = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });
const parts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });

const toDate = (value: string | null | undefined) => (value ? new Date(value) : null);

export const formatDateTime = (value: string | null | undefined) => {
  const d = toDate(value);
  return d ? dateTime.format(d) : 'Date to be announced';
};

export const formatDate = (value: string | null | undefined) => {
  const d = toDate(value);
  return d ? dateOnly.format(d) : 'N/A';
};

/** Day and short month for date badges, e.g. { day: '04', month: 'Oct' }. */
export const dateBadge = (value: string | null | undefined) => {
  const d = toDate(value);
  if (!d) return null;
  const p = parts.formatToParts(d);
  return { day: p.find((x) => x.type === 'day')!.value, month: p.find((x) => x.type === 'month')!.value };
};

/** Supabase returns a to-one join as an object or a one-item array depending on the schema. */
export const one = <T,>(value: T | T[] | null | undefined): T | undefined => (Array.isArray(value) ? value[0] : (value ?? undefined));
