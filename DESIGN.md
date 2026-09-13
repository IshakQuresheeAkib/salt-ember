---
version: alpha
name: "Salt & Ember"
description: "An amber-to-espresso, fire-led editorial restaurant identity for a premium dine-in experience in Sylhet."
colors:
  soft-amber: "#FFD9A3"
  golden-hour: "#FFB45C"
  sunset-orange: "#F28B2C"
  burnt-sienna: "#C35A1A"
  deep-amber: "#7A2E0B"
  rich-espresso: "#1A0D06"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
rounded:
  DEFAULT: "0.75rem"
  control: "0.625rem"
  panel: "1.25rem"
spacing:
  content-max: "77.5rem"
  reading-max: "40rem"
  section-block: "7rem"
components:
  navigation: {}
  button: {}
  menu-filter: {}
  form-field: {}
  dialog: {}
---

# Salt & Ember Design System

## Overview

### Creative North Star

The interface should feel like an evening service viewed across an open-fire pass: dark room, precise pools of light, close food texture, thin metal rails, and one line of visible heat. It is editorial and confident, but hospitality remains warmer than theatre.

### Product context and register

- **Audience and primary job:** Prospective diners in and around Sylhet who want to understand the restaurant, explore its sample menu, and try realistic reservation or private-event enquiry prototypes.
- **Target market and evidence:** Sylhet, Bangladesh, as stated in `PROJECT_CONTEXT.md` and the product brief. Restaurant details, menu claims, prices, reviews, hours, and photography remain provisional until the restaurant confirms them.
- **Locales and language policy:** English is the current interface language. Copy should be concise, conversational, and usable by readers with varied English fluency. The architecture must not prevent a future Bangla locale.
- **Usage scene:** Mobile discovery, social-link visits, and desktop planning for a meal or event. The page must work from 340px through large desktop widths and on short-height laptops.
- **Register:** Brand-led public marketing with small product-like interaction islands for menu filtering, testimonial controls, and prototype forms.
- **Memorable signature:** The Ember Seam: a narrow, off-centre structural line that aligns section boundaries, image crops, and selected transitions. It may glow once in the hero but must not become a continuous animated effect.
- **Restraint:** Navigation, menu filtering, forms, validation, disclosures, and contact details use quiet, familiar patterns. Food photography and display typography carry the expression.
- **Anti-references:** Generic orange-on-black restaurant templates, faux-luxury gold, glassmorphism, neon fire effects, rounded card grids, ordering-app UI, and dense decorative iconography.
- **Token ownership/runtime mapping:** The existing Tailwind v4 token layer in `app/globals.css` remains the runtime owner. This file mirrors the accepted semantic values and rationale. `PROJECT_CONTEXT.md` constrains the canonical names. Implementation maps each documented token through `@theme inline` or `:root` once and shared components consume semantic variables rather than raw colours.

## Colors

`rich-espresso` is the dominant page canvas and `deep-amber` carries raised surfaces and hero depth. `soft-amber` carries primary copy and becomes the deliberate light surface. Secondary copy is derived from Soft Amber and Deep Amber so it remains inside the supplied palette. `burnt-sienna` defines borders, gradient warmth, and secondary emphasis.

`sunset-orange` is the single interactive accent used for primary actions and selected controls. `golden-hour` is reserved for focus rings, fine rules, and sparing highlights. Burnt Sienna and Deep Amber create the restrained heat treatment without introducing a competing red theme. Rich Espresso is used for text on bright actions, while Soft Amber is used on dark surfaces. High-contrast and forced-colour modes may replace decorative treatments while preserving structure and visible focus.

## Typography

Cormorant Garamond is the display face for the hero thesis and major section headings only. It should feel cropped, composed, and editorial rather than ornate. Inter is the body, navigation, control, caption, status, price, and numeric face. Both load through `next/font` and map to `--font-display` and `--font-body`.

Display type uses fluid `clamp()` sizing, compact line height, and deliberate line breaks. Body copy uses generous line height and a maximum readable measure. Buttons and labels use sentence case; short utility labels may use restrained uppercase with tracking. Script typography is logo-only.

## Layout

The desktop system uses an asymmetric twelve-column composition within a maximum 77.5rem content width. The hero gives copy roughly seven columns and the primary image five, with the Ember Seam marking their tension rather than a hard card boundary. Sections alternate open Rich Espresso fields, Deep Amber bands, and one Soft Amber reservation field. The page favours editorial rails, lists, and large image planes over nested cards.

Mobile is recomposed rather than shrunk: copy precedes imagery, the Ember Seam becomes a short horizontal crop guide, signature dishes use labelled horizontal scrolling, menu filters can scroll without hiding selections, galleries simplify to a stable two-column rhythm, and forms stack in document order. Section spacing can compress below 768px without reducing touch targets. Sticky navigation must not obscure anchor destinations or keyboard focus.

Every image reserves its aspect ratio. Scrollbar geometry remains stable. Loading, validation, and feedback copy reserve enough space to prevent controls from jumping.

## Elevation & Depth

Depth comes from tonal contrast, image overlap, fine borders, and selective shadow under floating navigation or open overlays. Static content is predominantly flat. Heavy glow, glass panels, and repeated drop shadows are forbidden. The hero may use one tightly bounded heat bloom behind the focal image; other sections stay materially quiet.

## Shapes

Controls use the 0.625rem control radius and primary panels use the 1.25rem panel radius. Editorial image crops may use asymmetric corners or a clipped leading edge when the crop supports the section composition. Full pills are not a general-purpose shape; filter controls should read as compact rectangular tabs. Dividers are one-pixel Burnt Sienna or Golden Hour rules. Icons use consistent strokes without decorative containers unless the control needs a touch target.

## Components

### Foundational visual states

Every interactive element has default, hover, focus-visible, active, selected, disabled, and busy treatments where applicable. Focus uses a visible `amber` outline with sufficient separation. Selected menu filters combine colour with weight or a structural marker. Disabled controls reduce contrast and block handlers without disappearing. Busy controls keep their dimensions stable. Success and error messages are textual, announced, and kept adjacent to the affected task.

### Buttons and actions

Primary actions use solid Sunset Orange with Rich Espresso text. Secondary actions use a quiet Sunset Orange border on dark surfaces or Rich Espresso on the Soft Amber reservation field. Text links use a visible directional cue only when it reflects navigation. Labels stay stable from trigger through feedback: “Reserve a table” produces a reservation result, and “Send event enquiry” produces an event-enquiry result. Ordering, cart, delivery, and purchase actions are outside this milestone.

### Navigation and data display

The desktop header presents the logo, homepage anchors, and one “Reserve a table” action. Mobile uses an accessible menu disclosure or sheet with the same links and visible close control. Anchor targets account for the sticky header. Menu categories are filters, not ARIA tabs, unless matching tab panels are implemented. Signature dishes use an editorial rail; the broader menu uses a scannable list with price, category, provisional tags, availability, and clear empty results.

### Forms and overlays

Table reservation and private-event enquiry are distinct workflows. Each owns field labels, instructions, validation, pending state, simulated failure, simulated success, and reset. Both state plainly that no request was sent or stored. Forms use application validation with `noValidate`, preserve entered values after errors, focus the first invalid control, and prevent duplicate submission. Any mobile sheet or dialog includes an accessible title, focus handling, Escape behaviour, and focus restoration.

### Iconography

Use the Lucide family configured by shadcn with a consistent 1.5–2px stroke and optical sizing appropriate to the control. Icons support text; they do not replace important action labels. Social links use recognizable marks or explicit text labels with accessible names.

### Motion

Static responsive layout is the first acceptance gate. CSS owns hover, focus, and short state transitions. GSAP may later own one hero entrance and restrained section/image sequences after the static composition is approved. It must not animate every section, overlap CSS ownership, or run heavy scroll effects below 768px. Reduced motion removes automatic movement, leaves content complete, and presents the marquee statically. Persistent moving content includes a pause control.

### Content and data visualization

Copy is warm, direct, and specific without invented culinary claims. Primary actions are “Explore the menu,” “Reserve a table,” and “Send event enquiry.” Fixture prices use Bangladeshi taka formatting and are visibly identified as sample content until confirmed. Error copy explains what to correct; empty menu results invite the diner to clear filters. The site contains no charts or dashboard-style metrics.

## Do's and Don'ts

- **Do:** Let one large food image, editorial typography, and the Ember Seam establish the identity.
- **Do:** Keep fixtures separate from presentation and visibly distinguish unverified restaurant information.
- **Do:** Preserve a calm, familiar interaction model for navigation, filters, forms, and feedback.
- **Don't:** reintroduce ordering, cart, delivery, loyalty, or production-booking language.
- **Don't:** use generic card grids, pills, multiple glows, gradients on type, or ambient particle fields to manufacture visual interest.
- **Don't:** hide essential information or controls behind hover, drag, animation, or imagery.
