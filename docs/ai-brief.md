# Salt & Ember Shared AI Brief

Use this brief at the start of every v0, Bolt, Claude, Gemini, Codex, or Cursor task. The repository and its versioned documents are the source of truth. Read the relevant existing files before proposing or changing code.

## Project

Build Salt & Ember, a premium dine-in restaurant website for Sylhet, Bangladesh. The active milestone is the complete public frontend: architecture, visual design, responsive behaviour, accessibility, and realistic interaction prototypes.

Do not expand the current milestone into backend, authentication, admin, database, or production reservation work.

## Required stack

- Current patched Next.js 16.x using App Router and TypeScript strict mode.
- Tailwind CSS v4 and shadcn/ui.
- GSAP and ScrollTrigger for the approved motion pass.
- Server Components by default; browser-dependent animation and interaction logic belongs in small, focused client components.
- Use the repository package manifest as the authority for exact dependency versions. Do not copy version numbers from prompts.

## Deferred stack and capabilities

- Supabase, authentication, roles, admin routes, schemas, RLS, Storage, and production persistence are deferred.
- EmailJS is neither required nor a replacement for a future reservation data layer.
- Motion or Framer Motion is not a default dependency. Add one only when an accepted layout or exit animation provides a concrete reason, document its ownership, and never install both libraries.

## Design direction

- Mood: fire meets flavour—premium, warm, editorial, confident, and lively.
- Use the canonical tokens in `docs/brand.md`; do not introduce a competing palette or rename tokens.
- Let food photography, typography, dark negative space, and one restrained ember treatment carry the experience.
- Do not copy the inspiration site's identity, layout, components, or copy.
- Do not invent hero eyebrows, kickers, badges, pills, metrics, card grids, overlays, gradients, or major component families that are absent from the accepted concept.
- Preserve the accepted copy, hierarchy, section order, container model, image treatment, and colour temperature during implementation.

## Product boundaries

- Public routes: Home, Menu, About, Reservations, Gallery, and Contact.
- Use typed local fixtures for menu, gallery, testimonials, restaurant details, and prototype submission outcomes.
- Menu filters and forms must update meaningful local UI state; controls must not be decorative or inert.
- Reservation and private-event submissions are explicit prototypes and must not imply that a real request was stored or sent.
- No ordering, delivery, payments, loyalty programme, diner accounts, staff admin, or generic CMS in the current milestone.

## shadcn/ui rules

- Inspect project configuration and installed components before adding or importing a component.
- Use existing shadcn components and built-in variants before custom UI markup or one-off styling.
- Use semantic theme tokens rather than raw utility colours.
- Follow the correct accessible composition for forms, dialogs, sheets, drawers, cards, tabs, menus, avatars, loading states, empty states, and feedback.
- Fetch the current shadcn component documentation before implementing or changing a component API.

## React and Next.js rules

- Keep client boundaries narrow and minimize data serialized into client components.
- Start independent asynchronous work together and avoid request waterfalls.
- Import modules directly; dynamically load genuinely heavy, optional client features.
- Derive render state during render instead of synchronizing it through effects.
- Put interaction logic in event handlers, use stable keys, and avoid defining components inside components.
- Avoid unnecessary memoization and state subscriptions; optimize only where work is measurable or structurally expensive.
- Defer analytics and other non-essential third-party scripts until after hydration.

## Motion rules

- Build and approve static, responsive layouts before adding animation.
- GSAP owns scroll timelines, ScrollTrigger, pinning, parallax, and complex sequences.
- If Motion is later approved, limit it to named responsibilities such as exit states, shared-layout transitions, or a focused micro-interaction.
- Never let GSAP and Motion animate the same element property.
- Prefer transform and opacity animation over layout-triggering properties.
- Respect `prefers-reduced-motion`; the interface and information hierarchy must remain complete without animation.
- Do not add scroll-jacking, continuous distracting effects, or autoplay video as the only hero path.

## Engineering and quality rules

- Use precise TypeScript types or `unknown` at external boundaries; do not use `any`.
- Do not replace configuration, add packages, or change unrelated files without explaining the need first.
- Use Tailwind for responsive layout and common states. Reserve custom CSS for masks, texture, pseudo-elements, bespoke gradients, complex shadows, and tightly scoped visual effects.
- Use semantic HTML, visible focus styles, keyboard-operable controls, accurate image alternatives, and touch-friendly targets.
- Use `next/image`, stable aspect ratios, meaningful `sizes`, and preload only the true LCP image.
- Mobile is a deliberate composition, not a compressed desktop layout. Support 340px through large desktop and short-height laptop viewports.

## Design and verification workflow

1. Obtain an accepted page or section concept before visually driven implementation.
2. Record exact visible copy, section order, tokens, typography, component families, image roles, overlays, responsive behaviour, and motion cues.
3. Implement in page or section slices without inventing unapproved major UI.
4. Run lint, type, and production build checks supported by the repository.
5. Verify the rendered experience in a browser on desktop, mobile, and a short-height viewport.
6. Compare the accepted concept and the latest rendered screenshot for copy, layout, typography, palette, imagery, spacing, responsiveness, icons, and motion.
7. Verify the core menu and form prototype interactions, keyboard use, and reduced-motion state.

## Collaboration rule

Work on one focused feature at a time. Use a short-lived feature branch, review the diff, run the relevant checks, inspect the preview, and then merge to protected `main`. Do not paste whole generated projects into the repository; integrate only approved, scoped work.

## Task response format

Before coding, state the files to change, dependencies needed, implementation approach, and any risk or missing requirement. After coding, report the checks performed, visual comparison evidence, and remaining intentional limitations.
