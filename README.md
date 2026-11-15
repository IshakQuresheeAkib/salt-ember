# Salt & Ember

Salt & Ember is a frontend-only Next.js restaurant landing page for a Sylhet, Bangladesh concept. It presents a dark editorial "Ember Seam" direction using the Silver Mist, Flameburst Orange, and Midnight Shadow palette.

## Current experience

The single public route (`/`) contains:

- an anchor-linked header with desktop navigation and a fixed mobile bottom navigation bar;
- a hero with an accessible, rotating food selector, a visible pause/resume control, and reduced-motion support;
- an interactive food menu catalog (`#dishes`) featuring 136 dishes across 14 categories with responsive cards and direct WhatsApp ordering;
- a client-side carousel (`#menu`) displaying 28 scanned heritage menu pages;
- a testimonial section that uses animated columns when motion is allowed and a static nine-card grid when reduced motion is requested;
- a contact footer with the approved location, telephone/WhatsApp, and social links.

The dishes and pricing represent the culinary catalog. The testimonial section contains owner-approved public Google reviews and Facebook recommendations. The location, telephone/WhatsApp number, and Facebook/Instagram destinations are restaurant-approved. Direct ordering dispatches to WhatsApp chats with pre-filled dish details and triggers dual-layer Meta Pixel & Conversions API (CAPI) events.

## Stack

- Next.js 16 with the App Router and React 19
- TypeScript with strict checking
- Tailwind CSS v4 and the project CSS token layer
- GSAP with `@gsap/react` for text and hero movement
- Framer Motion for testimonial movement, bottom nav, and reduced-motion configuration

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Next.js. The runtime fetches remote menu images from Cloudinary; its domain (`res.cloudinary.com`) is allowed in `next.config.ts`.

## Verification

```bash
npm run lint
npm run type-check
npm run build
npm test
```

The repository contains focused Node test files under `tests/`. Browser-backed tests require a running local server and a matching `HERO_BASE_URL` or `TESTIMONIAL_BASE_URL` when the default port is not in use.

## Documentation

- `PROJECT.md` is the single implementation and contribution source of truth.

Before publishing, ensure all temporary placeholder dish images are replaced with licensed commercial assets per the launch gate in `PROJECT.md`.
