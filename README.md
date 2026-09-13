# Salt & Ember

Salt & Ember is a frontend-only Next.js restaurant landing page for a Sylhet, Bangladesh concept. It presents a dark editorial "Ember Seam" direction using the Silver Mist, Flameburst Orange, and Midnight Shadow palette.

## Current experience

The single public route (`/`) contains:

- an anchor-linked header with desktop navigation and a native mobile `<details>` menu;
- a hero with an accessible, rotating food selector, a visible pause/resume control, and reduced-motion support;
- a client-side sample menu that filters eight illustrative dishes by category;
- a testimonial section that uses animated columns when motion is allowed and a static nine-card grid when reduced motion is requested;
- a contact footer with sample address, email, telephone, and social-link placeholders.

The menu, testimonials, imagery, restaurant details, and social destinations are illustrative. The page does not accept reservations, send enquiries, process orders, take payments, or persist any visitor data.

## Stack

- Next.js 16 with the App Router and React 19
- TypeScript with strict checking
- Tailwind CSS v4 and the project CSS token layer
- GSAP with `@gsap/react` for text and hero movement
- Framer Motion for testimonial movement and its reduced-motion configuration

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Next.js. The runtime fetches remote images from Unsplash, Vercel Blob, and `cdn.21st.dev`; their domains are allowed in `next.config.ts`.

## Verification

```bash
npm run lint
npm run type-check
npm run build
```

The repository also contains focused Node test files under `tests/`. Browser-backed tests require a running local server and a matching `HERO_BASE_URL` or `TESTIMONIAL_BASE_URL` when the default port is not in use.

## Documentation

- `PROJECT_CONTEXT.md` is the implementation and contribution source of truth.
- `PRODUCT.md` describes the current product boundary.
- `DESIGN.md` and `docs/brand.md` define the visual system.
- `docs/ui-rules.md` and `docs/ai-brief.md` provide implementation guardrails.
- `plans/` and `docs/superpowers/` retain the current status of prior planning work.

Before publishing, replace every sample restaurant fact, testimonial, image, social destination, and contact value with restaurant-approved content.
