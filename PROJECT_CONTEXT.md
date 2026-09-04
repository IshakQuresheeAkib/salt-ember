# Salt & Ember — Claude Project Context

You are working on **Salt & Ember**, a premium dine-in restaurant website for Sylhet, Bangladesh. Tagline: *Flavour Meets Fire*.

This is a **frontend-only milestone**. No backend, no Supabase, no auth, no admin panel. All data comes from typed local fixtures in `lib/constants/`.

`docs/brand.md`, `docs/product.md`, `docs/ui-rules.md`, `docs/ai-brief.md` are derived briefs. `PROJECT_CONTEXT.md` is the source of truth for stack, tokens, motion rules, and form contracts. When in conflict, `PROJECT_CONTEXT.md` wins.

---

## Active Stack (exact versions — do not guess or substitute)

Check `package.json` for pinned versions. Do not copy version numbers from prompts.

- **Next.js 16** — App Router, `proxy.ts` (not `middleware.ts`), `next lint` removed (use `eslint .`)
- **React 19**
- **TypeScript** — strict mode, zero `any`, use `unknown` at external boundaries
- **Tailwind CSS v4** — `@theme` block in `globals.css`, not `tailwind.config.js`
- **shadcn/ui** — inspect installed components before adding new ones
- **GSAP 3.13+ (SplitText free since 3.13) + @gsap/react** — register core plugins and `useGSAP` once in `lib/gsap.ts`
- **Motion v12** — deferred; add only if page-exit animations concretely require `AnimatePresence`

---

## Design Tokens (canonical — use these names exactly, no aliases)

Defined as `--color-*` custom properties in `globals.css` under `@theme` so Tailwind v4 generates `bg-*` / `text-*` utilities. Never scatter raw hex values in component files.

```
ink         #0B0A09   → primary page background
charcoal    #181513   → raised surfaces, navigation
ash         #332D29   → borders, dividers, subtle texture
bone        #FFF4E8   → primary text, light surfaces
smoke       #B8A99A   → secondary/muted text
ember       #E84520   → primary brand accent, emphasis
chilli      #F6531A   → strong interactive accent
amber       #FFAA20   → highlights, secondary CTA accent
deep-red    #A7281A   → dark accent, gradient depth
```

**Forbidden aliases:** `char-black`, `cream`, `ember-orange`, `gold`, `bone-white`. Use only the token names above.

---

## Typography

- **Display:** Cormorant Garamond or Playfair Display — headlines only
- **Body/UI:** Inter or DM Sans — navigation, body, buttons, forms, prices
- **Script fonts:** logo-only, never used in interface components
- Load via `next/font`, not raw CSS `font-family` strings
- Use `clamp()` for fluid type scaling across 340px–1920px
- Import name: `Cormorant_Garamond` from `next/font/google`. CSS family name: `'Cormorant Garamond'`.

---

## Folder Structure

```
app/
├── layout.tsx
├── page.tsx                  → Home
├── menu/page.tsx
├── about/page.tsx
├── gallery/page.tsx
├── reservations/page.tsx
├── contact/page.tsx
├── globals.css

components/
├── layout/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── sections/                 → one file per homepage section
└── shared/                   → extracted only when 3+ components share a pattern

lib/
├── gsap.ts                   → register plugins once
├── types.ts                  → all TypeScript interfaces
└── constants/
    ├── menu.ts
    ├── gallery.ts
    ├── testimonials.ts
    └── nav.ts

docs/
├── brand.md
├── product.md
├── ui-rules.md
└── ai-brief.md
```

---

## TypeScript Interfaces

All types live in `lib/types.ts`. Key shapes:

```ts
type MenuCategory = 'starters' | 'mains' | 'grills' | 'sides' | 'desserts' | 'drinks'
type DietaryTag = 'vegetarian' | 'vegan' | 'halal' | 'spicy' | 'gluten-free'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  image: string
  tags: DietaryTag[]
  spiceLevel: 0 | 1 | 2 | 3
  isAvailable: boolean
  isFeatured?: boolean
}
```

---

## Styling Rules

**Tailwind handles:** layout, spacing, responsive breakpoints, colors via tokens, typography, standard transitions, focus/hover states.

**Custom CSS only for:** pseudo-elements (`:before`/`:after`), noise/grain texture, complex `box-shadow`, masks, bespoke gradients, GSAP target classes that need no Tailwind equivalent. Exception: raw hex permitted only inside SVG `<defs>`, data URIs, or `currentColor`-anchored strokes.

**Never:** raw hex values in component `className`, `space-x-*`/`space-y-*` (use `gap-*`), arbitrary `z-index` — use the `--z-*` token layer in `@theme` instead.

---

## Animation Rules

### GSAP owns:
- Scroll timelines, ScrollTrigger, pinning, parallax scrubbing
- SplitText character/word/line reveals
- Complex sequenced entrance animations
- All canvas effects (ember particles — only after performance profiling)

### CSS owns:
- Hover, focus, color transitions — anything needing no orchestration or exit state

### Motion owns (only after explicit approval):
- Page-exit animations via `AnimatePresence`
- Shared-layout transitions
- Named, scoped micro-interactions

### Hard rules:
- Never animate the same element property with both GSAP and Motion
- `useGSAP()` auto-cleans via its internal `gsap.context()` on unmount — do not return a manual cleanup. If a dependency array is used, the context only reverts on unmount; pass `{ revertOnUpdate: true }` to revert on dep change.
- `prefers-reduced-motion`: kill all GSAP timelines, Motion wraps in `<MotionConfig reducedMotion="user">`, marquee becomes static
- No smooth-scroll library (Lenis, etc.) in Phase 1. Native browser scroll only. If added later, decide explicitly and update this file.
- Mobile `< 768px`: no heavy scroll effects — CSS transitions only
- Marquee: persistent pause button required (WCAG 2.2.2), hover-only pause is non-compliant
- No shared wrappers (parallax, SplitText) until the same pattern appears in 3+ components
- No scroll-jacking, no autoplay video as LCP asset

---

## React & Next.js Rules

- Server Components by default; `"use client"` only where state, effects, event handlers, animation, or browser APIs are needed
- Never define components inside components
- Derive render state during render, not via effects
- Put interaction logic in event handlers
- Use functional state updates when next value depends on previous
- Use stable domain-derived keys for collections (`id`, not `index`)
- Import directly — no broad barrel imports
- Dynamically load heavy optional features (canvas, heavy animation) only
- Start independent async work together, await together — no waterfalls
- Minimize data serialized from Server → Client components
- In Next.js 16, `cookies()`, `headers()`, `params`, and `searchParams` are async (`Promise<…>`); always `await` them.

---

## shadcn/ui Rules

- Run project-info command before any component work
- Search installed components before writing custom UI
- Use `cn()` for conditional classes
- Never override component color/typography via `className` — use semantic tokens and variants
- Forms: `FieldGroup`, `Field`, `data-invalid` on Field, `aria-invalid` on control
- Dialogs/sheets/drawers: always include accessible titles
- Buttons: loading state = `disabled` + `Spinner`
- Avatars: always include fallback
- Pin remote image config in `next.config.ts` via `images.remotePatterns`, not the removed `images.domains`.

---

## Responsive Checkpoints

Build mobile-first. Base classes = 340px. Layer up:

```
340px → 375px → 768px → 1024px → 1280px → 1440px → 1920px
+ short-height laptop (MacBook 13/14" — ~800px viewport height)
- Also cover landscape phone (height < 500px) and tablet portrait (768–1024px) — do not skip between breakpoints.
```

Mobile is a deliberate composition, not a compressed desktop layout. Reduce layered motion, simplify overlays, keep reservation CTA reachable.

---

## CI (Next.js 16 — `next lint` removed)

```json
"scripts": {
  "lint":       "eslint .",
  "type-check": "tsc --noEmit",
  "build":      "next build"
}
```

Run all three before every merge. No `next lint` — it does not exist in Next.js 16. ESLint config is `eslint.config.mjs` (flat config, mandatory in Next.js 16). Do not copy `.eslintrc` examples from older tutorials.

---

## Pages & Section Order (Phase 1)

### Homepage sections (in order):
1. Navbar — sticky, blur backdrop, mobile drawer
2. HeroSection — fullscreen food image, typography reveal, one ember effect
3. MarqueeStrip — "Flavour Meets Fire · Salt & Ember · Sylhet ·" with pause control
4. SignatureDishes — horizontal scroll, parallax depth
5. AboutTeaser — staggered text + pinned image
6. MenuPreview — category tabs, card stagger on scroll
7. GalleryTeaser — masonry grid, hover zoom
8. Testimonials — draggable carousel with keyboard/touch controls
9. ReservationCTA — form prototype with full field/validation/loading/success/error/reset states
10. Footer — logo, links, social, hours, copyright

The `ReservationForm` component is shared by the homepage `ReservationCTA` and the `/reservations` page; copy differs, component does not.

### All pages:
Home, Menu, About, Gallery, Reservations (prototype only), Contact

---

## Reservation Form Rules

- Full states required: field validation, loading, success, error, reset
- Success state must explicitly say: "This is a prototype — no booking was sent or stored"
- Keep mock submission logic separate from presentation (future server handler drops in cleanly)
- No EmailJS, no Supabase, no real submission in Phase 1

---

## Visual Direction

- **Mood:** dark, editorial, confident, premium — fire meets flavour
- **Not:** generic orange-on-black, glassmorphism, rounded pills, neon, busy motion
- Large high-quality food photography as hero — close texture, flame, steam, visible craft
- Dark negative space gives content room to breathe
- Thin amber rules between sections
- Subtle noise/grain on hero and dark surfaces
- Asymmetric editorial layouts, selective overlap at section breaks: negative section margins + `clip-path` on the leading edge of the next section
- One or two strong image moments — not many small decorative assets
- Imagery is provisional. Placeholder food photography at `public/images/`. No CDN, no Supabase storage in Phase 1.

---

## What Is Out of Scope (Phase 1)

Do not suggest, implement, or reference any of these:

- Supabase (database, storage, auth, RLS, Edge Functions)
- Admin panel or staff routes
- EmailJS or any real email sending
- Guest accounts, ordering, delivery, payments
- Booking state management (pending/confirmed/cancelled)
- Production reservation persistence
- General CMS or page builder

---

## Build Order

```
1. globals.css tokens + fonts + layout.tsx
2. Navbar + Footer + page shells (all routes)
3. All lib/constants/ typed fixtures
4. Homepage composition (section by section)
5. Performance gate: LCP candidate, `next/image` audit, font subsetting
6. Menu page + filter interactions
7. About, Gallery, Reservations, Contact
8. GSAP animation pass (after static layouts accepted)
9. Responsive QA: 340px → 1920px + short-height
10. prefers-reduced-motion pass
11. Keyboard + accessibility pass
```

---

## Task Format Expected From Claude

Before any code:
1. State which files will change
2. State any new dependencies needed (with justification)
3. State implementation approach
4. Flag any risks or missing requirements

After code:
1. Report what checks were run
2. Note any intentional limitations
3. Flag anything that needs browser verification
