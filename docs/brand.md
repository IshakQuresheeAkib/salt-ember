# Salt & Ember Brand Guide

## Brand idea

Salt & Ember is where flavour meets fire: a confident, warm restaurant identity for Sylhet. The experience should feel premium and lively, never generic, overly rustic, or luxurious for its own sake.

## Colour system

Use the supplied Salt & Ember logo as the source for colour grading. The tokens below are canonical starting values and should be calibrated against an original transparent logo asset when available.

| Token | Suggested value | Use |
| --- | --- | --- |
| ink | `#0B0A09` | Primary page background |
| charcoal | `#181513` | Raised surfaces and navigation |
| ash | `#332D29` | Borders, dividers, subtle texture |
| bone | `#FFF4E8` | Primary text and light surfaces |
| smoke | `#B8A99A` | Secondary text |
| ember | `#E84520` | Primary brand accent and emphasis |
| chilli | `#F6531A` | Strong interactive accent |
| amber | `#FFAA20` | Highlights and secondary CTA accent |
| deep-red | `#A7281A` | Dark accent and gradient depth |

Use these token names consistently in documentation and implementation. Do not introduce aliases such as `char-black`, `cream`, `ember-orange`, or `gold` as a second palette.

Dark backgrounds are the default. Orange and red create focus rather than filling the interface. Maintain readable contrast and do not use amber for body text on light backgrounds.

## Colour lock

Once a visual concept is accepted, record its background, surface, text, border, shadow, and accent treatments. Implementation must preserve that colour temperature and intensity; do not replace black with softened cream or grey, add an unapproved tint, or reinterpret the palette for taste.

## Typography

- Display: an expressive editorial serif such as Cormorant Garamond or Playfair Display.
- Interface and body: a clean sans-serif such as Inter or DM Sans.
- Load fonts deliberately through `next/font` or approved local assets; naming a font in CSS is not sufficient.
- The logo's script treatment is logo-only. Do not introduce decorative script fonts throughout the interface.
- Headlines are compact, confident, and high contrast. Body copy is calm, readable, and generous in line height.
- Define typography for buttons, filters, form controls, navigation, captions, and status text; do not rely on browser defaults.

## Visual language

- Large, high-quality food photography with close texture, flame, steam, and visible craft.
- Editorial asymmetry, selective overlap, thin amber rules, restrained grain, and rounded-but-not-bubbly surfaces.
- Dark negative space gives content and calls to action room to breathe.
- Food remains the hero; effects support it.
- Prefer one or two strong image moments over many small decorative assets.
- Use open compositions, bands, rails, and whitespace before defaulting to card grids or nested containers.

## Hero direction

Begin with a strong food image, clear typography reveal, one primary action, and one restrained ember effect. The first viewport should keep a single focal point and reveal enough of the following section to establish page rhythm.

Do not begin with simultaneous Ken Burns movement, split text, particles, glow, gradient text, multiple badges, and competing mini-panels. Add canvas particles or further effects only after performance and accessibility checks show that they improve the accepted design.

## Image treatment

- Record each accepted image's role, crop, aspect ratio, edge treatment, overlay, mask, radius, and shadow before implementation.
- Do not add a colour overlay or tint when the accepted concept has none.
- Blend edges through a matching asset, transparent cutout, mask, edge fade, or background transition when needed.
- Product, signage, packaging, or brand text inside imagery should be rendered faithfully as part of that asset; navigation and interactive UI text remain code-native.
- Use a transparent SVG or high-resolution transparent raster logo in production, not a low-resolution social-media source.

## Concept fidelity

An accepted visual concept is the production design specification. Preserve its visible copy, hierarchy, section order, spacing, density, container model, typography, colour, imagery, icon treatment, and interaction model.

Do not invent hero eyebrows, kickers, pills, badges, fake metrics, extra dashboards, generic feature-card grids, or major component families merely to fill space. A deviation requires a concrete functional reason or explicit approval.

## Avoid

- Copying the supplied inspiration's layout, components, copy, or visual identity.
- Generic orange-on-black restaurant templates.
- Excessive glassmorphism, neon, card grids, rounded pills, or decorative icons.
- Continuous flame, particle, cursor, parallax, or marquee effects that compete with content.
- Hover-only information or interaction.
- Unverified dietary, price, opening-hour, testimonial, or location claims.
