# Salt & Ember UI Rules

## Foundation

- Build mobile-first from 340px. Base classes target mobile; larger layouts layer on responsive variants.
- Verify at 340px, 375px, 768px, 1024px, 1280px, 1440px, 1920px, and a short-height laptop viewport.
- Prefer fluid grids, `clamp()` type sizing, stable aspect ratios, and content-driven height. Avoid viewport-locked layouts that crop content on short screens.
- Use Tailwind CSS v4 for layout, spacing, colours, typography, standard states, and responsive behaviour.
- Use the canonical semantic tokens in `brand.md`; do not scatter raw colour utilities through product UI.
- Use a small custom CSS layer only for pseudo-elements, masks, texture and noise, complex shadows, bespoke gradients, and effects that utilities would make unreadable.
- Use `gap-*` in flex or grid layouts instead of `space-x-*` or `space-y-*`, and use `size-*` when width and height are equal.

## Design acceptance and fidelity

- Obtain an accepted page or section concept before visually driven implementation.
- Inventory exact visible copy, section order, typography, spacing, colours, image crops, overlay treatment, icons, component families, responsive continuation, and motion cues.
- Treat the accepted concept as a production specification; do not reinterpret its palette, container model, hierarchy, or imagery.
- Do not invent hero eyebrows, badges, pills, metrics, card grids, overlays, gradients, or major components absent from the concept.
- Implement long pages in section-sized slices and compare each rendered slice with its concept before continuing.

## shadcn/ui

- Run the shadcn project-information command before component work and use its actual framework, aliases, base, icon library, CSS path, and installed-component list.
- Search installed components and registries before writing custom UI. Use existing components and built-in variants first.
- Fetch current component documentation before implementing, changing, or debugging a shadcn component API.
- Use `className` for layout adjustments, not to override component colour or typography. Theme through semantic tokens and component variants.
- Use `cn()` for conditional classes and do not assign manual `z-index` values to overlay components.
- Forms use `FieldGroup` and `Field`; validation places `data-invalid` on `Field` and `aria-invalid` on the control.
- Related checkbox or radio controls use `FieldSet` and `FieldLegend`. Sets of two to seven choices use `ToggleGroup` rather than manually stateful buttons.
- `InputGroup` contains its matching input or textarea and uses `InputGroupAddon` for embedded actions.
- Dialogs, sheets, and drawers always include accessible titles. Tabs place triggers inside `TabsList`; select, menu, and command items remain inside their group components.
- Use full Card composition only where the accepted container model calls for cards. Use `Separator`, `Alert`, `Empty`, `Skeleton`, `Spinner`, `Badge`, and `sonner` instead of hand-built substitutes.
- Buttons express loading with `disabled` plus `Spinner`; icons use the project's configured icon library and component-supported `data-icon` placement.
- Avatars always include a fallback.

## React and Next.js architecture

- Render static content as Server Components by default. Add `"use client"` only to the smallest boundary that needs state, effects, event handlers, animation, or browser APIs.
- Keep fixtures, constants, and static JSX outside component bodies where practical.
- Do not define components inside components.
- Derive values during render instead of copying derived state through effects. Put user-triggered logic in event handlers rather than effects.
- Use functional state updates when the next value depends on the previous value, and lazy initialization for expensive initial state.
- Subscribe to the smallest state needed by a component; do not memoize simple primitive expressions.
- Use stable, domain-derived keys for collections.
- Import modules directly instead of relying on broad barrel imports. Dynamically load only genuinely heavy optional features such as a canvas effect or advanced animation.
- Start independent asynchronous work together and await it together. Do not create avoidable server or client request waterfalls.
- Minimize data serialized from Server Components into client components and defer non-essential analytics or third-party scripts until after hydration.

## Interaction and accessibility

- Controls are keyboard operable, touch friendly, and built with native semantic elements where possible.
- Every interactive state has a visible focus treatment and a clear selected, disabled, loading, error, and success state where applicable.
- Images require meaningful alt text; decorative images use empty alt text.
- Do not hide essential information behind hover, card flips, drag-only interaction, animation, or a generated image.
- Cursor followers are decorative only and disabled for touch, coarse-pointer, and reduced-motion environments.
- Carousels require labelled touch, pointer, and keyboard controls.
- Automatically moving non-essential content lasting more than five seconds needs a persistent pause, stop, or hide control. Hover pause alone is insufficient.
- A reduced-motion marquee becomes static or remains paused until the user explicitly starts it.

## Motion ownership

Static responsive composition comes first. Motion is progressive enhancement and must never be required to understand content or complete a task.

| Need | Owner | Rule |
| --- | --- | --- |
| Scroll timelines, pinning, scrubbed parallax, complex text or image sequences | GSAP | Keep logic scoped to a focused client component and clean it up on unmount. |
| Simple CSS hover, focus, and colour transitions | CSS | Prefer CSS when no orchestration, exit state, or layout tracking is needed. |
| Exit animations, shared-layout transitions, or a justified component micro-interaction | Motion, only after approval | Add one Motion package only, give it a named boundary, and do not overlap GSAP ownership. |

### GSAP rules

- Register plugins once, but scope timelines and ScrollTriggers to the component that owns the DOM.
- Use the framework integration's context cleanup rather than manually reverting the same context twice.
- Use scoped responsive and reduced-motion conditions for animation setup and teardown.
- Do not abstract SplitText, parallax, or particles until the same pattern appears in 3+ components.

### Motion rules when approved

- Use named variants for repeated or orchestrated states instead of duplicating animation objects.
- Components with exit animations are direct children of `AnimatePresence`, have stable unique keys, and define an explicit `exit` state.
- Use `layout="position"` or `layout="size"` when only one dimension of layout should animate; use global `layoutId` transitions sparingly.
- Prefer `x`, `y`, `scale`, `rotate`, and opacity over animating top, left, width, or other layout-triggering properties.
- Put gesture-specific timing with the gesture transition where required.
- Use restrained spring values and avoid decorative bounce that conflicts with the brand.
- Respect the user's reduced-motion preference through a zero-motion or near-instant alternative.

### Shared motion limits

- GSAP and Motion never animate the same property on the same element.
- Do not use scroll-jacking, blanket section reveals, or animation on every available element.
- Start the hero with a strong image, typography reveal, and one restrained ember treatment. Add canvas particles only after profiling.
- Do not make video the only hero path; provide a performant image or poster fallback.
- Animate a wrapper rather than a complex SVG when that reduces rendering cost.

## Forms and prototype state

- Reservation and private-event forms include field-level validation, submission, loading, failure, success, and reset states.
- Prototype submissions update real local UI state and clearly state that no booking or enquiry was sent or stored.
- Use typed form values and typed fixture responses. Keep mock submission logic separate from presentation so a future server handler can replace it.
- Do not introduce Supabase, authentication, EmailJS, or production booking rules during the frontend milestone.

## Imagery and performance

- Use `next/image` with explicit aspect ratios and meaningful `sizes`; preload or eagerly load only the true LCP image.
- Lazy-load below-the-fold media and defer non-essential animation code.
- Preserve the accepted image crop, overlay, mask, fade, radius, shadow, and background blend.
- Do not replace central approved assets with placeholders, generic stock crops, rough CSS drawings, or unapproved overlays.
- Keep client components small and avoid shipping heavy animation code to routes that do not use it.

## Verification

- Run repository-supported lint, type, and production build checks.
- Verify the first viewport, full scroll, navigation, menu filters, both prototype forms, and their state changes in a browser.
- Check desktop, mobile, and short-height viewports; confirm no clipping, overflow, accidental wrapping, or unusable controls.
- Compare the accepted concept and latest rendered screenshot for copy, section order, layout, typography, palette, imagery, spacing, container model, icons, responsiveness, and motion.
- Run an above-the-fold copy comparison; added, removed, renamed, or reordered visible text requires approval or a documented functional reason.
- Verify keyboard navigation, focus visibility, touch targets, static/reduced-motion presentation, and any persistent motion controls.
- Do not declare visual completion while a fixable mismatch remains.
