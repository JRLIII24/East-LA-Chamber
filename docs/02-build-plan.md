# eastlachamber.com — Rebuild Plan

Companion to `01-site-audit.md`. This is the proposal to review before any code is written.

---

## 1. Goals (from the brief)

1. Every page exists as code in this repo — no Webflow dependency.
2. The chamber's staff are too busy to maintain a site, so **all editable content lives in plain data files** (Markdown / JSON) that an AI session can edit from a one-line request ("add the November mixer", "add Taquería X to the directory under Restaurants").
3. Slight redesign: keep the brand, fix what's broken, raise it to a premium civic standard.
4. Placeholder photos get swapped for the real photos you'll supply.

## 2. Recommended stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Astro 5** (static output) | Zero JS shipped by default; built-in `<Image>` does responsive AVIF/WebP; **Content Collections** give typed Markdown/JSON data with schema validation — a malformed member entry fails the build instead of breaking the page. Plain `.astro` templates are just HTML, so the files stay AI-editable. |
| Styling | Plain CSS with custom properties (design tokens), no Tailwind | Same approach as the Innovative Repairs site; smallest surface for AI edits; no build-tool coupling. |
| Content | `src/content/{members,categories,events,resources,sponsors,gallery,board}` | One folder per content type; one file per item. |
| Images | `src/assets/` processed by Astro at build | Originals committed once; every size generated automatically. |
| Hosting | **GitHub Pages** (decided) | Same model as Innovative Repairs. Push to `main` → GitHub Actions builds and deploys. `public/CNAME` carries the custom domain. |
| Forms | **Web3Forms** (free, no account for the chamber to manage) | Contact, newsletter, membership application. Logo upload isn't on the free tier, so applicants attach it to the confirmation email. Access key lives in the repo variable `PUBLIC_WEB3FORMS_KEY`. |
| Events calendar | Static list + optional Google Calendar embed | Events are Markdown files; an ICS feed is generated at build so members can subscribe. |
| Search | **Pagefind** (static search index, built at deploy) | Full-text search over members + resources + events with zero backend. |
| Analytics | GA4 + Google Search Console | Add before launch. |
| Fonts | Self-hosted, 2 families, 4 files total | See §4. |

**Why not plain HTML like Innovative Repairs?** 100 member pages × 15 categories × events is too much duplication to hand-maintain; one typo in a shared header means 130 edits. Astro gives shared layouts and data-driven pages while still outputting plain static HTML.

## 3. Information architecture

```
/                           Home
/about/                     About (story, mission, values, board & staff)
/membership/                Join — benefits, tiers, pricing, application form
/membership/apply/          Application form (own page so it can be linked directly)
/directory/                 Category grid + search
/directory/<category>/      Category listing (15)
/directory/<category>/<member>/   Member page (100)         [301 from /directory/<member>]
/events/                    Upcoming + past, calendar view, ICS feed
/events/<slug>/             Event detail
/resources/                 Resident & business resources hub
/resources/<slug>/          Resource article (4 today)      [301 from /blog/*, /blog-categories/*]
/sponsors/                  Sponsor wall by tier + "become a sponsor"
/gallery/                   Albums (events, culture) — no logos here
/gallery/<album>/           Album
/news/                      Announcements (optional, phase 2)
/contact/                   Contact + map + hours            [301 from /contact-us]
/es/...                     Spanish mirror (phase 2)
/404                        Branded
sitemap-index.xml, robots.txt, rss.xml, events.ics
```

Primary nav (desktop): **About · Directory · Events · Resources · Gallery · Contact** + button **Join the Chamber**.
Mobile: full-screen menu, one tap to anything, phone number and Join button pinned at the bottom.

## 4. Design direction

**Concept: "Civic, warm, East LA."** Confident serif display type that nods to the 1922 seal, paired with a clean sans for UI. Brick red used with intent (CTAs, rules, accents) on warm paper tones instead of the template's black glass. Real photography of real people and streets, full-bleed. Generous whitespace, strong grid, nothing floating.

### Tokens
```
--brick:        #8f3f2a   primary / CTAs / links
--brick-deep:   #6e2d1f   hover, headings on light
--terracotta:   #c06b55   accents, tags
--ink:          #1a1a1a   body text
--ink-soft:     #4a4b45   secondary text
--paper:        #fbf7f2   page background (warm, not pure white)
--paper-2:      #f3ebe3   alternate section band
--blush:        #fff6f4   light tint for cards
--line:         #e5ddd4   rules & borders
--night:        #141210   dark sections (footer, feature bands)
--gold:         #c9a227   sparing — sponsor tier badges, "est. 1922"
```
All combos verified ≥ 4.5:1 for text (nav links move from `#9b352b` 3.9:1 to `--brick-deep` on paper, 7.1:1).

### Type
- **Display:** *Fraunces* (variable, optical sizes) — a warm, slightly soft serif that reads as civic/heritage without feeling like a law firm. Self-hosted, one variable file.
- **Text/UI:** *Inter* (variable) — already in the brand's CSS; legible at small sizes for directory data.
- Scale: 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 88 with `clamp()` for fluid headings.

### Components
Button (primary brick / secondary outline / ghost) · Card (member, event, resource, sponsor) · Section header (eyebrow + h2 + lede) · Stat tile · Logo wall · Photo grid (masonry) · Breadcrumb · Pagination · Tag/pill · Hours table · Map embed · Form fields with real labels · Alert/notice band · Footer with NAP + newsletter.

### Motion
Subtle fade-up on scroll via `IntersectionObserver` (10 lines, no jQuery). Content is visible by default and animates *in*, so nothing is ever hidden if JS fails. Honours `prefers-reduced-motion`.

## 5. Page-by-page build spec

### 5.1 Home
1. **Header** — seal logo, 6 nav links, "Join the Chamber" button. Sticky with shrink on scroll.
2. **Hero** — full-bleed photo (`PHOTO: hero`), eyebrow "East Los Angeles Chamber of Commerce · Est. 1922", h1 "Connecting people. Building community.", lede, CTAs **Become a Member** / **Find a Business**. Small inline search field for the directory.
3. **Stats band** — 4 tiles with *true* figures you confirm: Members · Years serving East LA · Events this year · Sponsors. Static numbers with a light count-up (not odometer digits).
4. **Upcoming events** — next 3 events as cards (date block, title, location, RSVP). Falls back to "past highlights" if none.
5. **Explore the directory** — 6 featured categories with counts + "View all 15 categories".
6. **Membership value** — 3 benefit columns + CTA. Pull from Join page copy.
7. **Sponsors** — tiered logo wall (Presenting / Gold / Community), each linking to the sponsor's site. From `sponsors.json`.
8. **Resources at your fingertips** — keep this module; 4 cards, fix broken link.
9. **Gallery teaser** — 5-photo collage from the latest album.
10. **Newsletter + footer** — NAP, hours, social (label X as "X"), quick links, "Site by…" if wanted.

SEO: `<title>East Los Angeles Chamber of Commerce | Supporting East LA Businesses Since 1922</title>`, `Organization` + `WebSite` JSON-LD, OG image = hero crop.

### 5.2 About
Hero with photo (`PHOTO: about-hero`) · Our Story (narrative + timeline 1922 → today) · Mission & Vision (once, side by side) · What We Stand For (4 values with simple line icons) · **Board of Directors & Staff** (new; cards with photo, name, role — from `board/*.md`) · CTA band "Join us".

### 5.3 Membership (`/membership/`)
Hero · Why join (6 benefit cards, keep copy) · **Membership tiers & pricing table** (need from chamber; if not public, "Contact us for rates") · Sponsorship tiers · How it works (3 steps) · FAQ (accordion) · CTA → `/membership/apply/`.

### 5.4 Apply (`/membership/apply/`)
Multi-section single-page form: Business info · Contact · Category + sub-category (from the collections) · Membership level · Logo upload (PNG/SVG, ≤ 2 MB) · Message · Turnstile · Submit. Emails chamber + sends applicant confirmation. Keeps "Download fillable PDF" as a secondary link.

### 5.5 Directory (`/directory/`)
Search bar (Pagefind, searches name/blurb/subcategory) · 15 category cards with icon + count (hide empty ones) · "Not listed? Join" band.

### 5.6 Category (`/directory/<category>/`)
Breadcrumb · h1 + intro · sub-category filter pills · member cards (logo, name, sub-category, 1-line blurb, phone `tel:`, "View") · pagination at 24 · JSON-LD `ItemList`.

### 5.7 Member (`/directory/<category>/<member>/`)
Breadcrumb · logo + name + sub-category tag · description · **structured hours table** (migrated out of free-text) · phone, website, address, socials · map · "More in <sub-category>" (excludes self) · "Is this your business? Request an update" link · `LocalBusiness` JSON-LD · OG image = logo.

Member schema (`members/<slug>.md` front matter):
```yaml
name: La Que Si Llena
category: food-beverage
subcategory: restaurants
phone: "+1 323-261-1864"
website: ""
address: ""
hours:
  mon-fri: "8:30am–7:30pm"
  wed: "Closed"
  sat-sun: "8:00am–7:30pm"
logo: ./la-que-si-llena.png      # alt generated as "<name> logo"
member_since: 2024
sponsor_tier: null               # or presenting | gold | community
featured: false
---
Comida Mexicana Auténtica…
```

### 5.8 Events (`/events/`)
Toggle Upcoming / Past · month grouping · card = date block, title, time, venue, cost, RSVP link · "Subscribe (ICS)" + "Add to Google Calendar" · past events show photo album link.

### 5.9 Event detail
Hero image (flyer or photo) · when/where/cost block with `Event` JSON-LD · description · RSVP button (external link or mailto for now) · map · gallery album if past · share buttons.

### 5.10 Resources hub + article
Hub: cards for each article grouped Residents / Businesses · emergency numbers pinned at top. Article: h1, meta (updated date), TOC for long ones, clean external links (strip the Google-search wrappers), "Last reviewed" date so staff/AI know when to refresh.

### 5.11 Sponsors
Tiered logo wall · what sponsorship includes · tier table · CTA to apply.

### 5.12 Gallery
Albums (e.g. "2025 Installation Dinner", "Captain Shawnee Meet & Greet", "Christmas Toy Giveaway") as cards · album page = masonry grid + lightbox (PhotoSwipe, kept) · every image has alt from the album JSON. Logos and flyers removed from here (they live on Sponsors / Events).

### 5.13 Contact
Two columns: form (name, email, phone, topic select, message, Turnstile) · info card (address with map link, `tel:`, email, office hours, socials) · embedded map · `ContactPage` JSON-LD.

### 5.14 404
Branded, lists the 6 main sections, directory search box.

## 6. Maintenance model (the "maintain with AI" part)

Everything a human or AI changes lives in these places and nowhere else:

| Want to… | Edit |
|----------|------|
| Add/remove a member | `src/content/members/<slug>.md` (+ logo in same folder) |
| Add an event | `src/content/events/<yyyy-mm-dd>-<slug>.md` (+ flyer) |
| Update sponsors | `src/content/sponsors.json` |
| Add photos | drop into `src/content/gallery/<album>/` + one line in `album.json` |
| Change copy on a page | the matching `src/pages/*.astro` — prose only, no classes to touch |
| Change colours/fonts | `src/styles/tokens.css` |
| Board changes | `src/content/board/*.md` |

Guard rails so AI edits can't break the site:
- Zod schemas on every collection (required `alt`, phone format, date format, category must exist).
- `npm run check` = Astro check + link checker + schema validation; runs in CI on every push.
- Preview deploys per branch on Cloudflare Pages so changes are reviewed on a URL before merging to `main`.
- A `CLAUDE.md` in the repo describing the content model and the rules above, so any future session knows exactly where to edit.

## 7. Phases

| Phase | Scope | Output |
|-------|-------|--------|
| **0. Approve this plan** | You review audit + plan, confirm stack, hosting, nav, tiers/pricing availability | Go/no-go |
| **1. Foundation** | Astro scaffold, tokens, fonts, layout, header/footer, SEO component, sitemap/robots, 404 | Deployed preview with Home skeleton |
| **2. Content migration** | Export Webflow CMS CSV → members/categories/resources; download + re-encode images; sponsors + gallery from the JS arrays; build events collection and backfill 2024–25 from flyers | All data in repo, build passing |
| **3. Pages** | Home, About, Membership, Apply, Directory (3 templates), Events (2), Resources (2), Sponsors, Gallery (2), Contact | Full site on preview URL |
| **4. Forms & integrations** | Pages Functions + Resend + Turnstile, logo upload, ICS feed, Pagefind, GA4 | Forms verified end-to-end |
| **5. Photo swap + polish** | Replace every `PHOTO:` placeholder with your supplied images; alt text pass; motion; a11y re-scan (axe 0 serious) ; Lighthouse ≥ 95 | Launch candidate |
| **6. Launch** | DNS cutover to Cloudflare Pages, 301 map, Search Console submit, Webflow kept read-only for 30 days | Live |
| 7. Spanish (optional) | `/es/` with `hreflang`, translated collections fields | |

## 8. Decisions / inputs I need from you before Phase 1

1. **Hosting**: Cloudflare Pages (recommended, forms built-in) or GitHub Pages (match Innovative Repairs, forms via a third-party endpoint)?
2. **Fonts**: Fraunces + Inter as proposed, or do you want to supply the chamber's intended typeface ("Mona Sans" was the original intent — it's free from GitHub and we can self-host it instead)?
3. **Webflow CMS export**: can you export the Directory collections to CSV (Webflow → CMS → collection → Export)? If not, I can scrape the 100 pages, but CSV is cleaner (it includes fields that may not be rendered).
4. **Membership tiers & pricing** — public, or "contact us"?
5. **True stat figures** for the stats band (members, events/yr, sponsors).
6. **Board & staff** list with photos (or skip for v1).
7. **Events**: do they already keep a calendar anywhere (Google Calendar, Eventbrite, Facebook Events)? If so we can sync rather than hand-enter.
8. **Photos**: you said you'll supply them. Placeholders in the build will be labelled `PHOTO: <name>` so the swap list is explicit.
9. **Spanish** in v1 or later?
