# eastlachamber.com — Site Audit

**Audited:** 2 Nov 2026 · **Current platform:** Webflow ("Neighborly" template) · **Pages crawled:** 11 static + 15 directory categories + 100 member pages + 4 blog/resource posts
**Method:** full HTML crawl, headless-Chrome screenshots (desktop 1440 / mobile 390), resource-weight measurement, axe-core WCAG 2.1 AA scan, computed-style inspection.

---

## Executive summary

The site has a solid information architecture (Home · About · Directory · Community Info · Gallery · Contact · Join) and decent copy, but it is held back by four things that a code rebuild fixes outright:

| # | Finding | Impact |
|---|---------|--------|
| 1 | **The site renders in Times New Roman by accident.** CSS asks for "Mona Sans" on every heading, paragraph, button and nav link, but that font is never loaded (only Inter is). Every visitor sees the browser's default serif. | Design — site-wide |
| 2 | **Homepage is 10.8 MB; Gallery is 31 MB.** Photos are shipped at 3000–4600 px wide and rendered at ~250 px. One 4606×3071 stock photo (2 MB) displays at 257×171. | Performance / mobile data / Core Web Vitals |
| 3 | **SEO basics are missing on every page.** No `sitemap.xml`, empty `robots.txt`, no canonical tags, no structured data, `<title>` of "Home" / "About" / "Join Us!", 6 `<h1>`s on the homepage, 100 % of images have empty `alt`. | Search visibility — the chamber is invisible for "East LA Chamber of Commerce"-adjacent queries it should own |
| 4 | **Content is hard-coded in places the chamber can't maintain.** Sponsors and the entire gallery are JavaScript arrays inside embed blocks ("OWNER: ADD/EDIT PHOTOS HERE ONLY"). Membership application is a PDF + a Gmail compose link. | The exact maintenance problem that motivated this rebuild |

Everything below is evidence for those four plus the smaller items.

---

## 1. SEO

### 1.1 Crawlability & indexing
- `robots.txt` → **empty file**. Not harmful, but no sitemap pointer.
- `sitemap.xml` → **404** (renders the 404 page). Google has to discover 130+ URLs by link-following only.
- No `<link rel="canonical">` on any page. Webflow serves `www.` with a 301 so duplication is low-risk, but canonicals are still expected.
- **Broken internal link**: `/resources/local-rules-regulations` is linked from the homepage "Resources at Your Fingertips" card and 404s. The content exists at `/blog/first-district-information`.
- Inconsistent URL scheme for the same content type: `/blog/emergency-numbers` vs `/resources/recycling-information` vs `/blog/recycling-information` (both exist). Pick one (`/resources/<slug>`) and 301 the rest.
- 404 page `<title>` is **"Not Found | Neighborly - Webflow HTML Website Template"** and its OG image points to the template vendor's CDN.
- `/blog/emergency-numbers` `<title>` is **"Emergency Numbers | Neighborly - Webflow HTML Website Template"** — this is live in search results today.
- HTTP→HTTPS 301 ✅ · HSTS preload ✅ · `lang="en"` ✅ · viewport ✅

### 1.2 Per-page metadata

| URL | `<title>` | Meta description | `<h1>` count | Verdict |
|-----|-----------|------------------|--------------|---------|
| `/` | "Home" | ✅ good | **6** ("Connecting", "People", "Building", "Community", "Stay", "Connected") | Title useless; h1 split across words for animation |
| `/about` | "About" | ✅ | 3 | Title useless |
| `/directory` | "Member Directory" | ✅ | 2 | OK-ish; add "East Los Angeles" |
| `/directory-categories/*` (15) | category name only | ❌ none | 1 | No descriptions, no location keyword |
| `/directory/<member>` (100) | "Name \| East Los Angeles Chamber of Commerce" | ❌ none | 1 | Best titles on the site; zero descriptions |
| `/events-and-resources` | "Events and Resources" | ✅ (generic) | 2 | Page contains **no events** — only 4 resource posts |
| `/gallery` | "Gallery" | ❌ none | **0** | |
| `/join-our-community` | "Join Us!" | ✅ | 1 | Title should carry "Membership" |
| `/contact-us` | "Contact Us!" | ✅ | 1 | |
| `/blog/emergency-numbers` | template leftover | ❌ | 0 | |
| `/resources/garbage-collection-schedule` | "East Los Angeles Chamber of Commerce" | ❌ | 0 | |
| `/resources/recycling-information` | same as above | ❌ | 0 | Duplicate title |

### 1.3 Heading structure
- Homepage has **125 heading tags**. 115 of them are `<h4>` elements wrapping single digits (`<h4>3</h4><h4>1</h4>…`) used by the odometer-style stat counters. Search engines read this as nonsense headings.
- Hero `<h1>`s are split one word per tag so each line can animate separately. Should be one `<h1>` with `<span>`s.
- Resource pages have zero `<h1>` (article title is an `<h2>`).

### 1.4 Images
- **Every image on every page has `alt=""`** (homepage 11/12, about 4/4, events 13/13, gallery 100 %). Sponsor logos, event photos, the chamber's own logo — none described.
- Member logos in the directory link to `href="#"` (41 empty-name links per category page).

### 1.5 Structured data
- **None.** Zero JSON-LD on any page. The site should carry:
  - `Organization` + `LocalBusiness` (chamber NAP: 4716 E Cesar E Chavez Ave, (323) 263-2005, info@eastlachamber.com)
  - `LocalBusiness` per member page (100 rich-result eligible pages)
  - `Event` for every event
  - `BreadcrumbList` on directory + resource pages
  - `WebSite` with `SearchAction` for the directory search

### 1.6 Social / Open Graph
- `og:title` mirrors the bad `<title>` ("Home").
- **No `og:image`** on any page except the two template-leftover pages, which point at the template vendor's thumbnail. Shares on Facebook/Instagram/X show no preview image.

### 1.7 Local SEO
- NAP is present in the footer as plain text only — no `schema.org/PostalAddress`, no `tel:` link on the phone number, no map on the Contact page.
- No Spanish content or `hreflang`. East LA is ~95 % Latino; a `/es/` version is a real differentiator for both residents and search.
- No analytics or Search Console tag detected (no GA4/GTM). The chamber has no visibility into traffic today.

### 1.8 Content gaps hurting search
- "Events and Resources" has **no events** — no calendar, no upcoming/past list, no event detail pages. This is the #1 content type a chamber ranks for ("East LA chamber mixer", "Wake Up with East LA").
- No "Board of Directors" / staff page. No "Sponsorship tiers" page. No news/announcements.
- Homepage says "680+ local businesses" but the directory lists **100**. Keep the claim only if it is true of membership, not the directory.

---

## 2. Performance

Measured with headless Chrome, desktop, cold cache, full-page scroll:

| Page | Transfer | Requests | Images | Notes |
|------|----------|----------|--------|-------|
| `/` | **10.81 MB** | 31 | 9.9 MB | 7 images > 500 KB |
| `/gallery` | **31.06 MB** | 62 | 30.7 MB | 3.7 MB JPEGs rendered at 289×217 |
| `/about` | 1.52 MB | 20 | 0.4 MB | Acceptable |

Worst offenders on the homepage:

| File | Size | Natural px | Rendered px |
|------|------|-----------|-------------|
| `IMG_20241004_160034424~2.jpg` | 2,549 KB | 3039×2759 | 174×158 |
| `pexels-rdne-5738196.jpg` | 2,037 KB | 4606×3071 | 257×171 |
| `Screenshot_20240921-070659~2.png` | 1,243 KB | 1011×615 | 274×167 |
| `IMG_20241004_154925844~2.jpg` | 1,177 KB | 3212×2312 | 246×177 |
| `2025_Via Care Logo (1).jpg` | 598 KB | — | 66 px tall sponsor logo |

Other performance notes:
- Webflow CSS is **148 KB** for a site that uses a fraction of it; plus jQuery 3.5 (90 KB) + three Webflow JS chunks for scroll-reveal animations that `IntersectionObserver` does in 10 lines.
- Google reCAPTCHA **and** Cloudflare Turnstile are both loaded on every page (two bot-protection scripts for one newsletter form).
- Inter is loaded in 5 weights (158 KB) and then **not used** for any visible text (see §3.1).
- Lazy-loading is applied to the hero logo and above-the-fold images (`loading="lazy"` on everything), which delays LCP.
- **Horizontal scrollbar** on `/events-and-resources` on both desktop and mobile (page width 1472 px in a 1440 viewport).
- Scroll-reveal animations hold wrappers at `opacity:0` until JS runs. Works for visitors, but a slow/failed script leaves pages blank — and reduced-motion users still get it.

Expected after rebuild: homepage < 800 KB, gallery < 2 MB initial (lazy, responsive `srcset`, AVIF/WebP), no jQuery, no reCAPTCHA, Lighthouse 95+ across the board.

---

## 3. Design

### 3.1 Typography is broken site-wide
`site.css` sets `--font-family--display-1/2: "Mona Sans"` and uses it for h1, h2, p, buttons and nav. **No `@font-face` for Mona Sans exists** and no font service loads it; the only fonts that load are Inter (5 weights, unused) and `webflow-icons`. Browsers fall back to the default serif — **Times New Roman** on Windows/Mac. Every screenshot in this audit shows it. This is the single highest-leverage fix for "premium".

### 3.2 What's working (keep)
- Brand palette is coherent and ownable: brick `#8f3f2a` / `#9b352b`, terracotta `#c06b55`, near-black `#1a1a1a`, warm off-white `#fff6f4`, light grey `#f8f8f8`. The round seal logo reads well at nav size.
- Dark sections with the terracotta CTA button have good presence.
- "Resources at Your Fingertips" card list is a genuinely useful module.
- Directory category pages have real content: name, subcategory, blurb, phone, hours, map.

### 3.3 What's not working
- **Hero** opens on three small floating photos (one is a phone-screenshot of a mural) scattered in whitespace, then the headline, then a stock-looking welcome-sign photo. The first screen communicates nothing about the chamber. Needs one strong full-bleed photo (a real event, a real East LA street) + headline + two CTAs (Join / Find a business).
- **Stat counters** render as "000 +", "00+", "0 0+", "00%" until the odometer animates — and the labels ("Homes in Community", "Resident Satisfaction") aren't chamber metrics. Replace with: Members · Years serving East LA (est. 1922 per logo) · Events per year · Sponsors.
- **Template DNA**: The "Neighborly" template's dark-glass cards, dotted-pill section labels, emoji icons (📌 🚨 ♻️), and "Click image to view" overlays are generic. A chamber of commerce site should feel civic, warm, and trustworthy — closer to a well-designed city or museum site than a SaaS landing page.
- **Mixed language in the header**: "Pages" dropdown is a developer label, not a navigation label. Visitors don't know "Community Info", "Gallery", "Contact" live under it. On mobile the hamburger hides everything.
- **Gallery** is a 46-tile uniform grid where sponsor logos, event flyers and photos are mixed at the same size and crop. Logos get cropped badly (see "ners inc", "ushe ACADEM", "ard mo"). Sponsors belong in a logo wall; flyers belong on event pages; photos belong in a masonry gallery.
- **About** page: "Mission Statement / Vision Statement" headings appear twice; the long pink section has one heading and a wall of text; "What We Stand For" values have no icons or imagery.
- **Directory landing** is a single dropdown ("Select a business or service…") on an empty page. The 15 categories should be visible as a grid with counts, with search on top.
- **Join page** is the best page on the site, but "Start Application" scrolls to a PDF download + "Email Completed Form" (`href="#"`, JS-opens Gmail). Should be an actual form.
- **Contact** has no map, no hours, no staff names. Phone isn't tappable.
- Footer newsletter button has no label/text (axe critical). Social links are text + icon but X is still labelled "Twitter".
- No favicon on the template-leftover pages; no dark-mode consideration (fine to skip, but choose deliberately).

### 3.4 Mobile
- Homepage mobile is a 5,366 px tall single column. Stat tiles stack 4-high before any content.
- Sponsor logos stack as four full-width white cards — large, but fine.
- Gallery mobile is **12,233 px** tall (46 full-width tiles).
- Events page horizontal overflow (see §2).
- Hamburger menu requires two taps to reach Contact (open → "Pages" → Contact).

---

## 4. Accessibility (axe-core, WCAG 2.1 AA)

| Severity | Issue | Where |
|----------|-------|-------|
| **Critical** | Submit button with empty `value=""` | Footer newsletter form, every page |
| Serious | Links with no discernible text | Logo link (every page), hero circle link, **41 directory image links per category page** (`href="#"`) |
| Serious | Colour contrast below 4.5:1 | Nav links `#9b352b` on white (3.9:1), `.hero-except` text on dark |
| Moderate | Heading order skips (h1 → h4, h2 → h5) | Every page |
| Moderate | No `<main>` landmark; content outside landmarks | Every page (16–53 regions per page) |
| — | Placeholder-only inputs on the contact form (labels exist but are visually hidden; fine) | Contact |
| — | Honeypot field `fax_number` is in the tab order (`tabindex` set, but still focusable by screen readers) | Contact |
| — | No skip link; no visible focus styles on the terracotta buttons | Site-wide |
| — | Emoji used as icons with no `aria-hidden` / text alternative | Resources cards, Join page |

---

## 5. Functionality

| Feature | Current state | Problem |
|---------|---------------|---------|
| Contact form | Webflow native form + Turnstile + reCAPTCHA + honeypot | Works only while hosted on Webflow. Must be replaced on migration. |
| Newsletter form | Webflow native, `method="get"`, Turnstile | Same. Also no confirmation of where submissions go. |
| Membership application | Fillable PDF download → user emails it back via `mailto:` or Gmail-compose link | No submission tracking, no confirmation, no logo upload, breaks on phones without a PDF editor (the page literally has a "Tip" apologising for this). |
| Sponsors strip | Hard-coded JS array in an embed block | Chamber staff can't edit; `url: "#"` on every sponsor. |
| Gallery | Hard-coded JS array of ~46 `{src,title,tag}` objects; PhotoSwipe lightbox | Staff must upload to Webflow Assets, copy URL, edit JS. |
| Directory | Webflow CMS: 15 categories, 41 sub-categories, 100 members, each with name, subcategory, blurb, phone, hours (as text), logo, map embed | The best-structured data on the site. Hours are free text with emojis inside the description field. "Related Business" on a member page lists the same business first. Category "Technology Services" has 0 members (empty page). |
| Directory search | A single `<select>` of categories that navigates to the category page | Not a search. No free-text, no sub-category filter, no "near me". |
| Events | None — the page is titled "Events" but contains 4 resource articles | A chamber's primary recurring content type is absent. |
| Resources | 4 Webflow CMS posts (First District Info, Recycling, Garbage Schedule, Emergency Numbers) | Good content, inconsistent URLs, no `<h1>`, external links wrapped in Google-search redirect URLs (`google.com/search?q=https://pw.lacounty.gov/…`). |
| Social | FB, IG, X in nav + footer | ✅ |
| Analytics | None detected | Install GA4 + Search Console before launch so the redesign's effect is measurable. |
| 404 | Template video + template title | Replace. |

---

## 6. Content inventory (for migration)

| Type | Count | Source | Migration plan |
|------|-------|--------|----------------|
| Static pages | 7 | Webflow pages | Rewrite as Astro pages |
| Directory categories | 15 (+ "Technology Services" empty) | Webflow CMS | `src/content/categories/*.json` |
| Directory sub-categories | 41 | Webflow CMS | field on member record |
| Members | **100** | Webflow CMS | `src/content/members/<slug>.md` — export via Webflow CSV export (Collections → Export) |
| Resource articles | 4 | Webflow CMS | `src/content/resources/*.md` |
| Sponsors | 4 on home, ~12 in gallery | JS arrays | `src/content/sponsors.json` with tier |
| Gallery items | ~46 | JS array | `src/content/gallery/*.json` by album; images re-exported from originals |
| Events | 0 | — | New collection; backfill from the 2024–2025 flyers in the gallery |
| Images | ~70 | Webflow CDN | Download originals, re-encode to AVIF/WebP at 400/800/1200/1600 widths |
| Membership PDF | 1 | Webflow Assets | Keep as a download; add a web form |
| Logo | PNG 297×315 + favicon set | Webflow Assets | Request vector (SVG) from the chamber |

---

## 7. Prioritised fix list

**P0 — fixed by the rebuild architecture itself**
1. Load the actual brand typeface (or choose one) — ends the Times New Roman fallback
2. Responsive, compressed images (`<Image>` component, AVIF/WebP, `srcset`)
3. Real `<title>`/description/canonical/OG image per page from a single SEO component
4. `sitemap.xml`, `robots.txt`, JSON-LD
5. One `<h1>` per page, semantic landmarks, alt text as required fields in content schema
6. Content in Markdown/JSON files so AI (or a human) edits data, never markup

**P1 — new functionality**
7. Events collection + calendar + event detail pages
8. Membership application web form (with logo upload) replacing PDF-by-email
9. Directory with real search + category grid + filters
10. Sponsors and gallery as content collections with tiers/albums
11. Working contact + newsletter forms off-Webflow
12. GA4 + Search Console

**P2 — polish / growth**
13. Spanish version (`/es/`) with `hreflang`
14. Board & staff page, sponsorship tiers page, news/announcements
15. Member self-service update request form
16. 301 map from every old Webflow URL to the new one (keep slugs identical where possible so most need none)
