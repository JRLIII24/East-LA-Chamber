/**
 * Single source of truth for chamber contact details and site-wide settings.
 * Edit here; every page, the footer, and the JSON-LD pick it up.
 */
export const site = {
  name: 'East Los Angeles Chamber of Commerce',
  shortName: 'East LA Chamber',
  url: 'https://eastlachamber.com',
  founded: 1922,
  tagline: 'Connecting people. Building community.',
  description:
    'The East Los Angeles Chamber of Commerce has supported local businesses, residents and community partners since 1922. Find a member business, attend an event, or join the chamber.',
  phone: '(323) 263-2005',
  phoneHref: 'tel:+13232632005',
  email: 'info@eastlachamber.com',
  address: {
    street: '4716 E Cesar E Chavez Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90022',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4716+E+Cesar+E+Chavez+Ave+Los+Angeles+CA+90022',
  },
  // TODO(chamber): confirm office hours
  hours: 'Mon–Fri, 9:00am–5:00pm',
  social: {
    facebook: 'https://www.facebook.com/eastlachamberofcommerce/',
    instagram: 'https://www.instagram.com/eastla.chamber/',
    x: 'https://x.com/eastlacham',
  },
  // Web3Forms access key — set in GitHub repo variables as WEB3FORMS_KEY and
  // exposed at build time as PUBLIC_WEB3FORMS_KEY. Forms are disabled until set.
  formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
} as const;

export const nav = [
  { label: 'About', href: '/about/' },
  { label: 'Directory', href: '/directory/' },
  { label: 'Events', href: '/events/' },
  { label: 'Resources', href: '/resources/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const cta = { label: 'Join the Chamber', href: '/membership/' } as const;
