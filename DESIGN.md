---
version: alpha
name: "Salt & Ember"
description: "A Silver Mist-to-Flameburst-to-Midnight, fire-led editorial restaurant identity for a frontend-only restaurant concept in Sylhet."
colors:
  silver-mist: "#E4E4E4"
  flameburst-orange: "#FC5000"
  midnight-shadow: "#050505"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
rounded:
  control: "0.625rem"
  panel: "1.25rem"
spacing:
  content-max: "90rem"
---

# Salt & Ember Design System

## Creative north star

The page should feel like an evening service seen across an open-fire pass: a dark room, close food texture, precise orange heat, and generous editorial space. The signature is **The Ember Seam**—the off-centre split and single curved path in the hero. It directs the eye without becoming a page-wide effect.

## Colour system

Midnight Shadow is the page canvas. Silver Mist is the readable light value and keyboard-focus treatment. Flameburst Orange is the sole high-emphasis accent for actions, active controls, fine rules, and the hero heat field. Derived surfaces use `color-mix()` from those three values only.

The hero art is the sole page-scale gradient: a muted Silver Mist value at the top, Flameburst Orange heat through the centre, then Midnight Shadow at the base. The field sits behind imagery; it is never a background for critical body copy.

## Typography and shapes

- Cormorant Garamond carries the hero and section display headings; Inter carries navigation, buttons, body copy, prices, labels, and status text.
- Use fluid display sizes and compact display leading. Body text remains calm and readable.
- Controls are rounded rectangles, not default pills. The current control radius is 0.625rem; primary visual panels use 1.25rem.
- Prefer thin Flameburst rules, image overlap, tonal depth, and negative space over decorative icons or dense card grids.

## Current component language

- **Header:** small logo mark, unobtrusive anchor navigation, and a native mobile disclosure menu.
- **Hero:** large editorial display copy beside one selected circular food image. The food moves along a fixed curve; category buttons and pause/resume remain visible and native-button accessible.
- **Menu:** centred introduction, compact category buttons, and an image-led two-to-four-column card grid. The heading explicitly identifies the menu as a sample.
- **Testimonials:** a restrained, vertically moving column presentation on motion-capable screens; a complete static grid with reduced motion.
- **Footer:** quiet contact information with no claim that its sample details are confirmed.

## Motion

Motion is progressive enhancement. GSAP is scoped to text reveals and hero image transitions. Framer Motion is scoped to testimonial columns. Respect `prefers-reduced-motion`: text reveals remain static, hero auto-rotation stops, and testimonials show every card without movement. Do not introduce scroll-jacking, autoplay video, or competing continuous effects.

## Content integrity

The current menu, restaurant story, testimonials, contact values, and imagery are all provisional. The design may demonstrate hierarchy and interaction, but it must not imply confirmed restaurant facts or live booking, delivery, payment, or ordering capability.

## Visual checks

Review the first viewport, anchors, hero selection/pause behaviour, menu filter transition, testimonial motion and reduced-motion fallback, focus visibility, 340px mobile composition, and large desktop composition. Do not treat a static source check as proof of rendered behaviour.
