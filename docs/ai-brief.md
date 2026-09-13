# Salt & Ember Shared AI Brief

Read `PROJECT_CONTEXT.md` first. It is the source of truth.

## Project

Maintain a frontend-only Next.js restaurant concept for Sylhet. The active route is one homepage with four current destinations: Hero, Menu, Reviews, and Contact. Do not claim that missing sections or operational features exist.

## Current stack

- Next.js 16, React 19, strict TypeScript, and Tailwind CSS v4.
- GSAP with `@gsap/react` owns hero and text animation.
- Framer Motion owns testimonial movement and reduced-motion configuration.
- `next/image` hosts are configured in `next.config.ts`.
- Use `npm run lint`, `npm run type-check`, and `npm run build`.

## Product boundary

No backend, database, authentication, booking, event enquiry, ordering, delivery, payments, CMS, admin tooling, or persistence exists. Menu and testimonial fixtures, contact details, and imagery are illustrative; do not turn them into unqualified restaurant claims.

## Design guardrails

- Preserve The Ember Seam and the `silver-mist`, `flameburst-orange`, `midnight-shadow` system.
- Cormorant Garamond is display type; Inter is UI/body type.
- Do not turn the page into a generic orange-on-black template, a dense card grid, or an effect showcase.
- Preserve the current anchors, native controls, visible pause mechanism, and reduced-motion fallback.

## Implementation guardrails

- Keep server components default; use client components only for local interaction, animation, or browser APIs.
- Use semantic elements, accessible labels, native buttons, and stable keys.
- Use `next/image`, defined dimensions, and approved remote hosts.
- Do not add a package or service without a concrete approved need and an update to the relevant documentation.
- Preserve uncommitted user work. Do not commit, deploy, or publish unless explicitly asked.

## Required verification

For a visual or interaction change, run appropriate static checks and inspect it in a browser at mobile and desktop sizes. Verify keyboard focus, anchors, motion-disabled presentation, hero controls, and menu filtering rather than assuming source-level checks are sufficient.
