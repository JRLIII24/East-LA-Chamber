import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

/** iCalendar feed of all non-draft events, so members can subscribe in Google/Apple/Outlook. */
export const GET: APIRoute = async () => {
  const events = (await getCollection('events')).filter((e) => !e.data.draft);
  const f = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${site.shortName}//Events//EN`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(site.shortName)} Events`, 'X-WR-TIMEZONE:America/Los_Angeles',
  ];
  for (const e of events) {
    const end = e.data.end ?? new Date(e.data.start.getTime() + 2 * 3600e3);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@eastlachamber.com`,
      `DTSTAMP:${f(new Date())}`,
      e.data.allDay ? `DTSTART;VALUE=DATE:${f(e.data.start).slice(0, 8)}` : `DTSTART:${f(e.data.start)}`,
      e.data.allDay ? `DTEND;VALUE=DATE:${f(end).slice(0, 8)}` : `DTEND:${f(end)}`,
      `SUMMARY:${esc(e.data.title)}`,
      `LOCATION:${esc(e.data.location.address ? `${e.data.location.name}, ${e.data.location.address}` : e.data.location.name)}`,
      `URL:${site.url}/events/${e.id}/`,
      `DESCRIPTION:${esc(`${e.data.cost}. Details: ${site.url}/events/${e.id}/`)}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return new Response(lines.join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
