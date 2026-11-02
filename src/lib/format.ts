const TZ = 'America/Los_Angeles';

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = {}) =>
  d.toLocaleDateString('en-US', { timeZone: TZ, month: 'long', day: 'numeric', year: 'numeric', ...opts });

export const fmtDateShort = (d: Date) => d.toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' });

export const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' });

export const fmtWeekday = (d: Date) => d.toLocaleDateString('en-US', { timeZone: TZ, weekday: 'long' });

export const month = (d: Date) => d.toLocaleDateString('en-US', { timeZone: TZ, month: 'short' });
export const day = (d: Date) => Number(d.toLocaleDateString('en-US', { timeZone: TZ, day: 'numeric' }));

/** "Sat, March 14 · 6:00 PM – 9:00 PM" */
export function eventWhen(start: Date, end?: Date, allDay = false) {
  const date = fmtDate(start, { weekday: 'short', year: undefined });
  if (allDay) return date;
  const t = fmtTime(start) + (end ? ` – ${fmtTime(end)}` : '');
  return `${date} · ${t}`;
}

export const telHref = (phone: string) => 'tel:+1' + phone.replace(/\D/g, '');
