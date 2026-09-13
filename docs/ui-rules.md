# Salt & Ember UI Rules

## Foundation

- Build mobile first and verify 340px, 480px, 800px, desktop, and short-height layouts when changing UI.
- Use `app/globals.css` token variables and Tailwind token utilities; do not scatter raw brand hex values through components.
- Use `gap` for grouped layout and stable image aspect ratios to avoid layout shift.
- Keep semantic HTML, native buttons, visible focus, keyboard operation, and touch-friendly controls as the default.

## Current interaction contracts

- Header links target `#top`, `#menu`, `#testimonials`, and `#contact`. New links require a matching, usable target.
- The mobile menu is a native `<details>` disclosure. Preserve its keyboard behaviour and visible summary control.
- Menu categories are filters implemented as pressed buttons, not ARIA tabs. A category change crossfades the old and new grid; the leaving grid is hidden from assistive technology.
- The hero selector is a set of pressed buttons. Automatic rotation pauses on hover, focus, document invisibility, explicit pause, and reduced-motion preference. Keep the pause/resume button visible.
- Testimonial animation is decorative. Its duplicate looping cards are hidden from assistive technology, and reduced motion renders the full static set.

## Motion ownership

| Area | Owner | Constraint |
| --- | --- | --- |
| Hero food transition and text block reveal | GSAP | Scope through `useGSAP`; do not manually duplicate its cleanup. |
| Testimonial column translation | Framer Motion | Wrap in `MotionConfig reducedMotion="user"`. |
| Hover and focus states | CSS | Prefer CSS where orchestration is unnecessary. |

Never allow GSAP and Framer Motion to animate the same property of the same element. Animation cannot be the only way to discover content or operate a control.

## Images and performance

- Use `next/image` with explicit dimensions and appropriate `sizes`.
- Keep priority loading for actual hero/LCP imagery only.
- Add remote image hosts to `next.config.ts` before using them.
- Do not use autoplay video or canvas effects without a measured performance case and reduced-motion alternative.

## Checks

Run lint, type-check, and build for a source change. In the browser, test anchors, desktop/mobile navigation, hero selection and pause state, menu filters, reduced-motion testimonials, focus visibility, and content clipping.
