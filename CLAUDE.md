# East Los Angeles Chamber of Commerce — eastlachamber.com

Static site built with **Astro 5**, deployed to **GitHub Pages** from `main` via `.github/workflows/deploy.yml`. Custom domain via `public/CNAME`.

This file is the operating manual for maintaining the site (by a person or an AI session). Read it before changing anything.

## Commands

```bash
npm install          # once
npm run dev          # local dev server
npm run check        # astro check (types + content schemas) — CI runs this
npm run build        # astro build + pagefind index → dist/
npm run preview      # serve dist/
```

A failing `npm run check` or `npm run build` means a content file is malformed (see schemas in `src/content.config.ts`). Fix the content; don't loosen the schema.

## Where things live — edit content, not markup

| To change… | Edit | Notes |
|---|---|---|
| Chamber phone, email, address, hours, social links | `src/data/site.ts` | Used by header, footer, contact page, JSON-LD |
| Main navigation | `src/data/site.ts` → `nav` | |
| Colours, fonts, spacing | `src/styles/tokens.css` | Never hard-code colours in pages |
| **Add / edit a member** | `src/content/members/<slug>.md` | See member template below. Logo/photo go in `src/content/members/_images/` |
| Member categories | `src/content/categories.json` | 13 categories; `id` is the URL slug |
| Sub-categories | `src/content/subcategories.json` | Each maps to one category |
| **Add an event** | `src/content/events/<yyyy-mm-dd>-<slug>.md` | See event template below. Flyer image in the same folder |
| Resource articles | `src/content/resources/<slug>.md` | Markdown body; `updated:` date shows as "Last reviewed" |
| Sponsors / logo wall | `src/content/sponsors.json` + logos in `src/content/sponsors/` | `tier`: presenting · gold · community |
| **Add photos** | `src/content/gallery/<album>/album.json` + image files in that folder | Every photo needs `alt` |
| Board & staff | `src/content/people/<slug>.md` | `group`: board · staff |
| Page copy (About, Membership, Contact…) | `src/pages/*.astro` — prose only | Don't restructure markup to change words |
| Membership application PDF | `public/downloads/membership-application.pdf` | |
| Forms | Web3Forms key in repo variable `PUBLIC_WEB3FORMS_KEY` | Forms post to api.web3forms.com; key is public by design |

Things marked `TODO(chamber)` in code are facts to confirm with the chamber (stats, tiers, hours, vision wording, milestones). Things marked `PHOTO:` are placeholder images to replace.

## Content templates

### Member — `src/content/members/juans-tacos.md`
```md
---
name: "Juan's Tacos"
category: "food-beverage"           # id from categories.json
subcategory: "restaurants"          # id from subcategories.json (optional)
excerpt: "Family-run taquería on Whittier Blvd since 1987."   # ≤ 220 chars, shown on cards
phone: "(323) 555-0123"             # exactly this format
website: "https://juanstacos.com"   # optional
address: "4500 Whittier Blvd, Los Angeles, CA 90022"          # optional
hours:                              # optional, free-form keys
  "Mon–Fri": "8:00am–9:00pm"
  "Sat–Sun": "9:00am–10:00pm"
logo: "./_images/juans-tacos-logo.png"    # optional
photo: "./_images/juans-tacos.jpg"        # optional
featured: false
sponsorTier: null                   # or presenting | gold | community
---
Longer description in Markdown. Paragraphs, links and bold are fine.
```
URL becomes `/directory/food-beverage/juans-tacos/`. The filename is the slug — keep it lowercase with hyphens, and don't rename existing files (it changes the URL).

### Event — `src/content/events/2026-03-14-spring-mixer.md`
```md
---
title: "Spring Business Mixer"
start: 2026-03-14T18:00:00-07:00    # ISO with Pacific offset (-07:00 PDT, -08:00 PST)
end: 2026-03-14T20:00:00-07:00
location:
  name: "TELACU Industries"
  address: "5400 E Olympic Blvd, Commerce, CA 90022"
cost: "Free for members · $15 guests"
rsvp: "https://eventbrite.com/..."  # optional; without it the button goes to the contact form
image: "./2026-03-14-spring-mixer.jpg"   # optional flyer
imageAlt: "Spring Mixer flyer"
album: "2026-spring-mixer"          # optional, id of a gallery album (after the event)
tags: ["mixer"]
---
Description in Markdown.
```
Past events move to "Recent events" automatically. The `/events.ics` feed is regenerated on build.

### Gallery album — `src/content/gallery/2026-spring-mixer/album.json`
```json
{
  "title": "Spring Mixer 2026",
  "date": "2026-03-14",
  "description": "One line about the event.",
  "cover": "./mixer-01.jpg",
  "photos": [
    { "src": "./mixer-01.jpg", "alt": "Members networking at TELACU during the Spring Mixer" },
    { "src": "./mixer-02.jpg", "alt": "Board president speaking at the podium" }
  ]
}
```
Resize photos to ≤ 1800 px on the long side before committing (keeps the repo small; Astro generates all smaller sizes).

## Rules

1. **Never remove `alt` text or the schema requirement for it.** Decorative images use `alt=""` deliberately.
2. One `<h1>` per page. Interior pages get it from `PageHero`.
3. Every page sets `title` and `description` via the `Base` layout → `Seo` component. Titles are "Specific thing | East LA Chamber"; don't write "Home" or "Page".
4. Don't add client-side JavaScript frameworks. Small vanilla `<script>` blocks in `.astro` files are fine.
5. Don't change URLs of existing content. If something must move, add a redirect (GitHub Pages: a page at the old path with `<meta http-equiv="refresh">`, see `src/pages/redirects/`).
6. Keep images in the repo under ~2 MB each; Astro's `<Image>` handles the rest.
7. After changing content, run `npm run check && npm run build` before pushing. CI runs the same.

## Deploy

Push to `main` → GitHub Actions builds and publishes. Pull requests build but don't deploy. First-time setup: repo **Settings → Pages → Source: GitHub Actions**, and add repo variable `PUBLIC_WEB3FORMS_KEY`.

## Old-site URL map (for redirects)

| Old (Webflow) | New |
|---|---|
| `/contact-us` | `/contact/` |
| `/join-our-community` | `/membership/` |
| `/events-and-resources` | `/events/` |
| `/directory/<member>` | `/directory/<category>/<member>/` |
| `/directory-categories/<cat>` | `/directory/<cat>/` (`members`, `corporate-sponsors` → `/directory/`) |
| `/blog/emergency-numbers` | `/resources/emergency-numbers/` |
| `/blog/first-district-information`, `/resources/local-rules-regulations` | `/resources/local-rules-and-regulations/` |
| `/resources/garbage-collection-schedule`, `/blog/garbage-collection-schedule` | `/resources/garbage-collection-schedule/` |
| `/resources/recycling-information`, `/blog/recycling-information` | `/resources/recycling-information/` |
