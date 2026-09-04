# Salt & Ember UI Rules

## Foundation

- Build mobile-first from 340px. Base classes target mobile; larger layouts layer on responsive variants.
- Verify at 340px, 375px, 768px, 1024px, 1280px, 1440px, 1920px, and a short-height laptop viewport.
- Prefer fluid grids, clamp() type sizing, aspect ratios, and content-driven height. Avoid fixed viewport-height compositions that crop content on short screens.
- Use Tailwind CSS v4 for layout, spacing, colours, typography, standard states, and responsive behaviour.
- Use a small custom CSS layer only for pseudo-elements, masks, texture and noise, complex shadows, bespoke gradients, and effects that Tailwind utilities would make unreadable.

## shadcn/ui

- Use shadcn/ui primitives for accessible interface behaviour: dialogs, sheets, selects, tabs, accordions, buttons, forms, and toasts.
- Theme shadcn components to Salt & Ember tokens; do not accept default neutral styling unchanged.
- Do not add components simply because they are available. Prefer fewer, deliberate interaction patterns.

## Interaction and accessibility

- All controls must be keyboard operable, have visible focus states, and use native semantic elements where possible.
- Images require meaningful alt text; decorative images use empty alt text.
- Do not hide essential information behind hover, card flips, drag-only interaction, or motion.
- Cursor followers are decorative only and must be disabled for touch and coarse-pointer devices.
- Carousels require touch, mouse, and keyboard controls with accessible labels.

## Motion

- GSAP owns scroll timelines, pinning, parallax, and complex reveal sequences.
- Every GSAP animation is contained in a client component and cleaned up when that component unmounts.
- Do not add Motion or Framer Motion by default. If added, give it a narrow documented responsibility and never animate the same element or property as GSAP.
- Motion is progressive enhancement: the page must remain usable before JavaScript finishes loading.
- Respect prefers-reduced-motion; simplify or remove decorative motion for affected users.
- Do not use scroll-jacking.
- Automatically moving non-essential content running for more than five seconds needs a pause, stop, or hide mechanism.
- Do not make video the only hero rendering path; provide a performant poster or image fallback.

## Performance

- Use next/image for images, explicit aspect ratios, descriptive sizes, and only preload or eagerly load the true LCP asset.
- Lazy-load below-the-fold visual content and defer non-essential animation code.
- Keep client components small; render static content as Server Components by default.
