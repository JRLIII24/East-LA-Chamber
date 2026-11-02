/**
 * Content collections — the data model for everything editable.
 * Each collection is a folder under src/content/. Schemas are enforced at build.
 */
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const phone = z
  .string()
  .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must look like (323) 555-0123')
  .optional();

/** Top-level directory categories (15). */
const categories = defineCollection({
  loader: file('./src/content/categories.json'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string().default('store'),
    order: z.number().int(),
  }),
});

/** Sub-categories (41) — each belongs to one category. */
const subcategories = defineCollection({
  loader: file('./src/content/subcategories.json'),
  schema: z.object({
    name: z.string(),
    category: reference('categories'),
  }),
});

/** Member businesses — one Markdown file each, body = description. */
const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      category: reference('categories'),
      subcategory: reference('subcategories').optional(),
      excerpt: z.string().max(220).optional(),
      phone,
      email: z.string().email().optional(),
      website: z.string().url().optional(),
      address: z.string().optional(),
      hours: z.record(z.string()).optional(),
      logo: image().optional(),
      photo: image().optional(),
      social: z
        .object({ facebook: z.string().url().optional(), instagram: z.string().url().optional(), yelp: z.string().url().optional() })
        .optional(),
      sponsorTier: z.enum(['presenting', 'gold', 'community']).optional(),
      featured: z.boolean().default(false),
      memberSince: z.number().int().optional(),
      draft: z.boolean().default(false),
    }),
});

/** Events — upcoming and past. */
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
      allDay: z.boolean().default(false),
      location: z.object({ name: z.string(), address: z.string().optional() }),
      cost: z.string().default('Free'),
      rsvp: z.string().url().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      album: reference('albums').optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

/** Resource articles for residents and businesses. */
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(200),
      audience: z.enum(['residents', 'businesses', 'everyone']).default('everyone'),
      icon: z.string().default('file-text'),
      image: image().optional(),
      imageAlt: z.string().optional(),
      updated: z.coerce.date(),
      pinned: z.boolean().default(false),
      order: z.number().int().default(100),
    }),
});

/** Sponsors (logo wall). */
const sponsors = defineCollection({
  loader: file('./src/content/sponsors.json'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tier: z.enum(['presenting', 'gold', 'community']),
      logo: image(),
      url: z.string().url().optional(),
      member: reference('members').optional(),
    }),
});

/** Gallery albums — one JSON file per album with its photos. */
const albums = defineCollection({
  loader: glob({ pattern: '**/album.json', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      cover: image(),
      photos: z.array(z.object({ src: image(), alt: z.string().min(3), caption: z.string().optional() })).min(1),
    }),
});

/** Board & staff. */
const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      group: z.enum(['board', 'staff']),
      organization: z.string().optional(),
      photo: image().optional(),
      order: z.number().int().default(100),
    }),
});

export const collections = { categories, subcategories, members, events, resources, sponsors, albums, people };
