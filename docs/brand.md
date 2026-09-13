# Salt & Ember Brand Guide

## Brand idea

Salt & Ember is a premium, fire-led restaurant concept for Sylhet. Its character is warm and editorial, never generic, faux-luxury, neon, or overly rustic. Food and type carry the experience; interaction remains quiet and familiar.

## Canonical palette

| Token | Value | Use |
| --- | --- | --- |
| `silver-mist` | `#E4E4E4` | primary text, deliberate light details, and focus outlines |
| `flameburst-orange` | `#FC5000` | primary actions, selected controls, fine rules, and heat |
| `midnight-shadow` | `#050505` | page canvas, raised-surface base, and text on bright controls |

`app/globals.css` is the runtime token owner. Use semantic derived tokens such as `surface`, `border`, and `muted-foreground` instead of adding another palette. Do not reintroduce the retired amber tokens.

The hero art alone may run from muted Silver Mist through Flameburst Orange into Midnight Shadow. Elsewhere, use flat dark fields and restrained orange emphasis.

## Typography

- Cormorant Garamond is the display face for the hero and major section headings.
- Inter is the UI and body face for navigation, actions, labels, prices, and prose.
- Fonts load through `next/font` in `app/layout.tsx`.
- Script styling is not a general interface treatment.

## Visual language

- The Ember Seam is the off-centre hero split and fixed curved food path.
- Use close, high-quality food imagery, dark negative space, fine orange rules, restrained grain, and deliberately soft shadows.
- Prefer one strong image field and clear editorial grouping over badges, metrics, dense panels, or default card grids.
- Use rounded rectangles for controls. Pills are reserved only where a compact category control needs them.

## Content rule

The current photos, dishes, prices, testimonials, and restaurant details are samples. They demonstrate the visual system but are not approved public claims. Replace them as a complete approved content set before publishing.
