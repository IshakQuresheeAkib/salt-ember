# Salt & Ember

> **Current implementation reference.** This document describes the repository as it exists in the working tree. It serves as the single reference for project scope, design tokens, architecture, and engineering rules. It does not establish that restaurant claims, menu items, imagery, testimonials, contact details, or external profiles have received client publication approval.

## 1. Product

Salt & Ember is a single-page restaurant website built for a dining venue in Sylhet, Bangladesh. The application operates on one public route: `/`.

### Delivered page capabilities

- Header navigation and mobile bottom navigation linking to the four primary sections: `#top`, `#menu`, `#testimonials`, and `#contact`.
- Desktop navigation bar, external Google Maps hero link, and fixed mobile bottom navigation bar.
- Hero presentation with a selectable six-item food orbit and automated rotation.
- Interactive food menu section (`#dishes`) featuring 14 category tabs, glassmorphic dish cards, badges for popular and spicy items, prices in Bangladesh Taka, and direct WhatsApp ordering actions.
- Client-side carousel displaying 28 scanned menu pages served from Cloudinary.
- Testimonial presentation with animated vertical columns or a static grid when reduced motion is preferred.
- Dual-layer conversion tracking combining client Meta Pixel and server Meta Conversions API (CAPI).
- Structured SEO data implementing Schema.org Restaurant, WebSite, and Menu specifications.
- Contact footer with phone, WhatsApp, Google Maps, Facebook, and Instagram links.

### System boundaries

The repository contains no database, user authentication, content management system, ordering database, in-app payment gateway, or administration dashboard.

Dish orders link to WhatsApp chats with pre-filled order messages.

### Content approval boundary

The code renders restaurant copy, dish descriptions, prices, reviews, photographs, and contact links.

External stakeholders have not verified these values for legal publication. Treat all copy and media as implementation fixtures that require owner review before production launch. Specifically, current dish images in `lib/constants/food-menu-data.ts` are temporary placeholders; final images will be uploaded to Cloudinary and linked later.

## 2. Brand and visual system

### Visual direction

The interface uses a dark, fire-led visual style. Orange accents represent heat and embers.

Visual signatures include an asymmetric hero with curved orbit motion, dark glassmorphic cards with subtle backdrop blur, circular food imagery, and clean borders.

### Runtime tokens

`app/globals.css` defines the shared design tokens. Components access these tokens through Tailwind classes or CSS variables.

| Token | Value | Role |
| --- | --- | --- |
| `--silver` | `#E4E4E4` | Primary body text and keyboard focus ring |
| `--orange` | `#E36414` | Primary brand accent, active tabs, and rules |
| `--midnight-shadow` | `#0B2228` | Page background canvas and dark button text |
| `--surface` | derived via `color-mix()` | Raised dark container surfaces |
| `--muted-foreground` | derived via `color-mix()` | Secondary descriptions and helper text |

Tailwind v4 maps these tokens to `background`, `foreground`, `card`, `border`, `primary`, `muted-foreground`, `silver`, `orange`, `surface`, and `midnight-shadow` utility classes.

### Typography

- `Cormorant Garamond` loads as `--font-display`.
- `Inter` loads as `--font-body` for all standard copy.
- `Yeon Sung` loads as `--font-title` for section headings and hero titles.

### Responsive layout

The layout uses a responsive page gutter of `clamp(16px, 4.5vw, 112px)` and limits content containers to 2200px.

Configured breakpoint rules:
- `mobile`: below 480px.
- `tablet`: below 801px.
- `desktop`: 801px and wider.

On screens below 801px, the hero stacks into a single column, and the fixed bottom navigation bar activates.

The menu page carousel presents three visible cards on narrow viewports and five cards on wider screens.

## 3. Technical architecture

### Technology stack

- Next.js 16.3.4 (App Router)
- React 19.2.8
- TypeScript 5.9.3 (strict mode)
- Tailwind CSS 4.3.3 with `tw-animate-css`
- GSAP 3.15.0 and `@gsap/react` 2.1.2 (hero orbit, line reveals, SVG underline)
- Framer Motion 13.2.0 (food tab transitions, testimonial columns)
- Meta Graph API v22.0 via Next.js Server Actions with `after()`
- `next/image` for responsive image rendering
- Lucide React 1.45.0 for icons
- `@netlify/plugin-nextjs` for serverless hosting compatibility

### Repository structure

```text
app/
  actions/meta-conversion.ts     # server action for background Meta CAPI dispatch
  layout.tsx                     # document metadata, fonts, SEO schema, Meta Pixel
  page.tsx                       # single-page component tree
  globals.css                    # design tokens and custom CSS primitives
components/
  header.tsx                     # desktop and mobile navigation
  hero-section.tsx               # hero copy, CTAs, and food orbit wrapper
  hero-food-selector.tsx         # GSAP hero food orbit and auto-rotation
  food-menu-section.tsx          # categorized food menu with category tabs
  food-menu-card.tsx             # glassmorphism food card with WhatsApp order CTA
  menu.tsx                       # menu page viewer wrapper
  testimonials.tsx               # Framer Motion animated reviews
  footer.tsx                     # contact links and social media controls
  meta-pixel.tsx                 # client Meta Pixel script loader and route tracker
  mobile-bottom-nav.tsx          # fixed mobile bottom navigation
  ui/                            # buttons, tabs, carousels, text animations
lib/
  constants/                     # menu items, categories, reviews, social links
  card-carousel-layout.mts       # carousel math and responsive coordinates
  gsap.ts                        # registered GSAP plugins and custom eases
  meta-capi.ts                   # server-only Meta Conversions API client
  pixel-tracker.ts               # client event helper and cookie resolver
  seo-schema.ts                  # Schema.org JSON-LD structured data builder
  types.ts, utils.ts             # shared TypeScript types and utilities
scratch/
  menu-template.csv              # exported food menu spreadsheet (CSV)
  menu-template.xlsx             # exported food menu spreadsheet (Excel)
scripts/
  export-menu-template.mjs       # exports food menu fixtures to CSV template
  import-food-menu.mjs           # parses CSV/XLSX and regenerates TypeScript data
  read-xlsx.py                   # Python helper for binary Excel parsing
tests/                           # automated Node test suites
public/
  images/food/                   # local transparent PNG food dish images
  images/menu/                   # local menu preview images
  hero-food/                     # local hero orbit dish images
```

### Rendering boundaries

`app/page.tsx` renders on the server. Client components handle browser events, animation frames, and user state:

- `hero-food-selector.tsx`: monitors visibility, viewport dimensions, and GSAP timelines.
- `food-menu-section.tsx`: stores active category filter and renders dish cards.
- `food-menu-card.tsx`: manages image load state, WhatsApp order URLs, and conversion events.
- `card-carousel.tsx`: tracks active menu page index, keyboard arrows, and gesture swipes.
- `testimonials.tsx`: drives continuous column translation with Framer Motion.
- `meta-pixel.tsx`: observes route changes and executes browser pixel events.

### Image hosting rules

Remote image hostnames configured in `next.config.ts`:
- `res.cloudinary.com` (scanned menu pages and media assets)
- `lh3.googleusercontent.com` (Google Photos CDN dish images)
- `pngimg.com` (food dish illustrations)

Local images reside in `public/images/food/` and `public/hero-food/`.

## 4. Menu data and spreadsheet pipeline

### Data source and models

`lib/constants/food-menu-data.ts` stores canonical menu fixtures. It exports 14 food categories and 136 food dishes.

> [!WARNING]
> **Launch Gate — Commercial Image Licensing:** The 125 `pngimg.com` food illustrations used in `lib/constants/food-menu-data.ts` are CC BY-NC 4.0 temporary development placeholders. Because Salt & Ember is a commercial establishment, these placeholder images **must be replaced** with licensed, proprietary, or royalty-free commercial photography (hosted on Cloudinary or local storage) prior to public production launch. Commercial deployment with `pngimg.com` assets is strictly prohibited.

Each category defines five fields:
- `id`: unique category identifier (e.g., `beef-steaks`, `starters`).
- `name`: full display name.
- `shortName`: compact name for mobile tabs.
- `description`: culinary overview of the category.
- `pageReference`: page label from the printed menu PDF.

Each dish (`FoodItem`) defines these attributes:
- `id`: unique kebab-case slug generated from dish name.
- `name`: dish title.
- `price`: price string in Bangladesh Taka (e.g., `550 TK` or dual price `850 / 1000 TK`).
- `category`: key linking to a valid category ID.
- `portion`: optional portion specifier (e.g., `1:1`, `4 pcs`, `8" / 12"`).
- `description`: optional ingredients or preparation text.
- `image`: local path or remote URL (currently temporary placeholders; permanent Cloudinary links to be added later).
- `isPopular`: optional boolean flag for popular badge.
- `isSpicy`: optional boolean flag for spicy indicator.

### Export workflow

Run the export script to generate a spreadsheet template from current TypeScript fixtures:

```bash
node scripts/export-menu-template.mjs
```

This command writes `scratch/menu-template.csv`.

### Import workflow and validation

Run the import script to update `lib/constants/food-menu-data.ts` from a CSV or XLSX file:

```bash
node scripts/import-food-menu.mjs scratch/menu-template.csv
# or
node scripts/import-food-menu.mjs scratch/menu-template.xlsx
```

The import engine applies these validation rules:
- Validates category IDs against the 14 approved categories.
- Verifies price strings contain digits only. It strips and re-applies ` TK` automatically.
- Generates kebab-case slugs from dish names. It resolves duplicates with category prefixes or numeric suffixes.
- Converts boolean flags (`TRUE`/`FALSE`, `1`/`0`, `yes`/`no`) into TypeScript booleans.
- Supports `.csv` directly without extra dependencies. Binary `.xlsx` parsing invokes `scripts/read-xlsx.py` and requires Python 3.

## 5. Analytics and tracking (Meta CAPI)

### Dual-layer tracking architecture

The application implements dual-layer conversion tracking. Browser events fire through Meta Pixel, and matching server events fire through the Meta Conversions API (CAPI).

### Event deduplication

Each tracked interaction creates a unique event ID through `generateMetaEventId()`. The ID uses the format `evt_<timestamp>_<random>`.

The client passes this ID to both Meta Pixel and the server action. Meta matches the shared ID to deduplicate browser and server records.

### Context resolution

`lib/pixel-tracker.ts` reads `_fbp` and `_fbc` cookies on the client. If `_fbc` is missing, it builds the value from any incoming `?fbclid=` URL query.

The server action resolves client IP and User-Agent headers. It inspects `x-nf-client-connection-ip` for Netlify deployments and falls back to standard headers.

### Server action execution with after()

`app/actions/meta-conversion.ts` executes server calls. It uses Next.js `after()` to handle HTTP requests in the background.

This execution guarantees tracking completes on serverless runtimes without slowing user navigation to WhatsApp or external destinations.

### Server-side CAPI implementation

`lib/meta-capi.ts` enforces `server-only` execution. It sends conversion payloads to Meta Graph API `v22.0`.

The code normalizes Bangladesh phone numbers to E.164 format (`+880`). It applies SHA-256 hashing to sensitive fields before dispatch.

### Tracked events

- `InitiateCheckout`: Fires when a visitor clicks the WhatsApp order action on a food card. Payload includes dish name, category, ID, and price in BDT.
- `Contact`: Fires when a visitor clicks telephone links, general WhatsApp links, or Google Maps directions.
- `PageView`: Fires in `components/meta-pixel.tsx` on initial page mount and route transitions.

### Environment variables and fallback

The tracking layer reads credentials from `.env.local`:
- `NEXT_PUBLIC_META_PIXEL_ID` (and server fallback `META_PIXEL_ID`): Meta Pixel ID.
- `META_CAPI_TOKEN`: System user access token for Graph API CAPI calls.
- `META_TEST_EVENT_CODE`: Test event code from Meta Events Manager > Test events tab.

When credentials are missing, tracker functions exit silently. All user interactions continue without error.

### Testing and verification workflow

1. **Meta Events Manager Test Events Tab**:
   - Copy your server test event code (e.g., `TEST12345`) from **Events Manager > Your Dataset > Test events** tab.
   - Configure `META_TEST_EVENT_CODE=TEST12345` in `.env.local` for local development.
2. **Server-Side Verification CLI**:
   - Run `npm run verify:meta -- --dry-run` to validate CAPI payload structure without network calls.
   - Run `npm run verify:meta` (or `npm run verify:meta -- --code=TEST12345`) to dispatch an active test event to Meta Graph API and verify receipt in Events Manager.
3. **Browser Testing & Deduplication**:
   - In Events Manager Test events tab, use the "Test Browser Events" URL opener or Meta Pixel Helper to observe browser `PageView` and `InitiateCheckout`.
   - In non-production environments, passing `?test_event_code=TEST12345` in the URL forwards the test code to the server action, allowing server events to route into the test sandbox.
   - Meta automatically deduplicates matching client and server events via the shared `event_id` and marks them with a green "Deduplicated" badge.
4. **Production Safeguard**:
   - Test event codes are strictly stripped whenever `NODE_ENV === "production"` unless explicitly overridden on preview environments using `META_ALLOW_TEST_EVENTS=true`.
   - Remove or leave blank `META_TEST_EVENT_CODE` on production host deployments (Vercel/Netlify).

## 6. SEO and structured data

### Schema.org graph

`lib/seo-schema.ts` generates JSON-LD structured data injected into `app/layout.tsx`.

The structured data graph includes:
- `WebSite`: Canonical URL, search descriptions, and English (Bangladesh) language tagging.
- `Restaurant`: Name, phone, geographic coordinates (Sylhet, Bangladesh), address, opening cuisine list, and map reference.
- `Menu`: Contains `hasMenuSection` arrays for each category. Each section links `hasMenuItem` nodes containing name, description, image, and price offers in `BDT` currency.

### Search and security configuration

- `app/robots.ts`: Permits global search indexing and points to the XML sitemap.
- `app/sitemap.ts`: Generates sitemap entry with weekly change frequency.
- `next.config.ts`: Enforces security response headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## 7. Styling architecture

Component markup uses Tailwind CSS v4 utility classes for sizing, flexbox layout, grid alignment, typography, and hover feedback.

`app/globals.css` retains rules for features impractical with inline utilities:
- Global design token definitions and CSS custom properties.
- Keyboard `:focus-visible` treatments.
- Keyframe animations for map pins and glow rings.
- Dynamic DOM elements inserted by GSAP SplitText.
- Hero orbit curves and coordinate geometry.
- Glassmorphism backdrop filter support for food cards.
- Reduced-motion animation cancellation overrides.

## 8. Interaction, motion, and accessibility contracts

### Navigation anchors

- Shared primary navigation anchors resolve to `#top`, `#menu`, `#testimonials`, and `#contact`; `#dishes` is anchorable for direct deep-linking and CAPI event attribution.
- Mobile bottom navigation synchronizes active tabs with scroll position and URL hash.
- Keyboard focus uses a two-pixel Silver Mist outline (`#E4E4E4`) with a four-pixel offset.

### Hero food orbit

- Six food categories: Appetizer, Biriyani, Burger, Kebab, Pasta, Pizza.
- Automatic rotation cycles every 500ms when the document is visible.
- Rotation pauses when `prefers-reduced-motion` is enabled or the browser tab is hidden.
- Selecting an item updates an aria-live region to inform screen reader users.

### Categorized food menu

- Category tabs implement `role="tablist"` with individual `role="tab"` elements.
- Active tabs toggle `aria-selected="true"`.
- Tab panels use `role="tabpanel"` linked to matching tab IDs via `aria-labelledby`.
- Dish cards provide accessible WhatsApp ordering buttons with descriptive `aria-label` text.

### Testimonials and motion safety

- Standard mode animates three vertical columns in a continuous translation loop.
- Loop elements repeat with `aria-hidden="true"` to prevent duplicate screen reader reading.
- When `prefers-reduced-motion` is detected, column animation stops and renders a static three-column grid.

## 9. Content ownership

Update these files when modifying static business information:
- Menu items and categories: `lib/constants/food-menu-data.ts` (or run import script). *Note: Current dish images are temporary; final images will be uploaded to Cloudinary and updated here later.*
- Scanned menu pages: `lib/constants/menu.ts`.
- Customer reviews: `lib/constants/testimonials.ts`.
- Contact numbers, WhatsApp links, social profiles: `lib/constants/social-media.ts` and `lib/constants/site.ts`.
- Page title and meta descriptions: `app/layout.tsx`.

## 10. Engineering rules

- Keep components server-rendered by default. Add `"use client"` only for user state, DOM listeners, or animation hooks.
- Use Next.js Server Actions with `after()` for background API tasks. Do not block client response threads.
- Guard server-only secrets with `import "server-only"`. Never expose API tokens to the client bundle.
- Keep GSAP and Framer Motion scopes separated. Do not animate the same DOM properties with both libraries.
- Optimize images with `next/image`. Provide width, height, and meaningful alt text for content images.
- Keep automated tests passing. Add unit tests in `tests/` when introducing business logic or data pipelines.

## 11. Local development and verification

### Commands

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm test
npm run build
```

The test runner executes 80+ unit tests across components, layout coordinates, SEO schema, CAPI dispatch, and spreadsheet parsers:

```bash
npm test
# or run a specific test file
node --test tests/food-categories-tabs.test.mjs
```

Three integration tests verify live HTTP responses and run when `npm run dev` is active. They skip safely when the local server is inactive.

### Verification checklist

Verify UI changes across mobile (375px) and desktop (1280px) viewports:
- Header and mobile bottom navigation resolve to `#top`, `#menu`, `#testimonials`, `#contact`.
- Hero orbit rotates cleanly and honours reduced motion.
- Food menu category tabs switch dishes with smooth layout transitions.
- WhatsApp order buttons open chat with correct pre-filled dish details and price.
- Scanned menu carousel accepts keyboard arrow navigation and touch drag.
- Structured data passes Google Rich Results testing without schema warnings.

## 12. Documentation status

`PROJECT.md` replaces the prior project, product, design, docs, and plan documents. It is the current implementation reference.
