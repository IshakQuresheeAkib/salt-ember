# Salt & Ember homepage redesign

**Status:** Approved for implementation  
**Date:** 2026-09-10  
**Visual direction:** The Ember Seam

## Objective

Replace the current partial restaurant homepage with the complete public frontend defined by `PROJECT_CONTEXT.md`: a distinctive, accessible, responsive single-page experience that helps guests explore Salt & Ember, understand the restaurant, and use realistic but explicitly simulated reservation and private-event enquiry flows.

The redesign remains frontend-only. It must not introduce ordering, delivery, payments, accounts, staff tooling, production persistence, or claims that a booking or enquiry was transmitted.

## Current-state findings

The current homepage establishes the canonical dark palette and font loading, but it diverges from the maintained product contract:

- Gallery, reservation, private-event, and complete contact experiences are absent.
- The navigation points to missing or mismatched anchors; the menu component uses `#heritage-menu` while links target `#menu`.
- Reviews and Contacts share one footer target, and the mobile header exposes no equivalent navigation.
- Cart, shop, order, delivery, discount, and favourite affordances imply an ecommerce product that is expressly out of scope.
- The automatically changing hero selector lacks a persistent pause control and relies on UI that competes with the intended single hero focal point.
- Menu data is embedded in presentation code, uses US-dollar prices, and lacks the typed fixture boundary required by the project brief.
- The page is dominated by repeated rounded cards and pills rather than the accepted editorial rails, open compositions, and large image moments.
- The global stylesheet contains both accepted tokens and extensive one-off component styling, including raw colours outside the canonical system.

## Chosen approach

Use a brand-led editorial composition called **The Ember Seam**. A narrow, off-centre structural line aligns the hero split, image crops, and selected section transitions. It is the single expressive risk. All task-oriented areas remain restrained and familiar.

Two alternatives were rejected:

- A dense “Chef’s Ledger” treatment would make menu exploration strong but would underplay hospitality, imagery, and reservations.
- A minimal “Night Table” treatment would create atmospheric first impressions but would make the required fixtures, forms, testimonials, and local-discovery content feel appended rather than integrated.

The chosen direction balances atmosphere with the full product milestone and avoids the generic orange-on-black restaurant-card aesthetic.

## Information architecture and visible copy

`PROJECT_CONTEXT.md` is authoritative where its section order differs from derived briefs.

1. **Sticky navigation**
   - Links: Home, About, Menu, Gallery, Reservations, Contact.
   - Primary action: “Reserve a table.”
   - All links are homepage anchors with accurate target IDs.
2. **Hero**
   - Heading: “Flavour meets fire.”
   - Supporting copy: “A fire-led dining room in Sylhet, built around generous plates, bright ingredients, and the pleasure of staying awhile.”
   - Actions: “Explore the menu” and “Reserve a table.”
   - One large close-texture food photograph; no ordering UI, badges, metrics, or carousel.
3. **Marquee strip**
   - Text: “Flavour meets fire · Salt & Ember · Sylhet ·”
   - A labelled pause/resume control is always available while motion is active.
4. **Signature dishes**
   - Heading: “From the fire.”
   - An editorial horizontal rail of a small number of featured fixtures.
   - No purchase, favourite, or cart actions.
5. **About**
   - Heading: “Heat is only the beginning.”
   - Story copy and one tall kitchen image in an asymmetric composition.
6. **Menu**
   - Heading: “The Salt & Ember menu.”
   - Category, dietary, spice, and availability filters driven by typed fixture properties.
   - Notice: “Sample menu — dishes, dietary details, availability, and prices are awaiting restaurant confirmation.”
   - Empty result: “No dishes match these filters. Clear filters to see the full sample menu.”
7. **Gallery**
   - Heading: “Around the table.”
   - A stable asymmetric image mosaic with meaningful alternative text.
8. **Testimonials**
   - Heading: “Guests, in their own words.”
   - Clearly labelled provisional testimonial fixtures in a keyboard-, touch-, and pointer-operable carousel.
9. **Reservations and private events**
   - Heading: “Your table is waiting.”
   - Primary table-reservation prototype and a visually separate private-event enquiry flow introduced by “Planning something larger?”
   - Success disclosure: “This is a prototype — no booking was sent or stored.”
   - Event success uses the equivalent noun: “This is a prototype — no enquiry was sent or stored.”
10. **Contact and footer**
    - Heading: “Find us in Sylhet.”
    - Address, phone, email, hours, map treatment, and social links from typed provisional fixtures.
    - Visible notice: “Restaurant details shown here are sample content pending confirmation.”

## Visual system

The project-root `DESIGN.md` is the durable visual contract. The existing Tailwind v4 variables remain the runtime token owner and retain the canonical names from `PROJECT_CONTEXT.md`.

- Dark `ink` is dominant; `charcoal` supplies limited tonal depth.
- `bone` is primary copy and one intentional light reservation field.
- `ember` carries the Ember Seam; `chilli` carries high-emphasis actions; `amber` carries focus and fine rules.
- Cormorant Garamond is limited to major headings; Inter owns body and controls.
- The page uses open rails, lists, large image planes, and asymmetric editorial grids rather than repeated cards.
- Controls use compact rounded rectangles. Pills are not the default shape.
- Static composition is completed and visually approved before the GSAP motion pass.

## Component architecture

Static content remains in Server Components. Client boundaries are limited to stateful interactions.

### Layout components

- `components/layout/navbar.tsx`: sticky desktop navigation, mobile trigger, anchor links, and reservation action.
- `components/layout/mobile-navigation.tsx`: focused client boundary for the accessible small-screen menu.
- `components/layout/footer.tsx`: contact details, hours, social links, provisional-content notice, and copyright.

### Section components

- `components/sections/hero-section.tsx`
- `components/sections/marquee-strip.tsx`
- `components/sections/signature-dishes.tsx`
- `components/sections/about-section.tsx`
- `components/sections/menu-section.tsx`
- `components/sections/gallery-section.tsx`
- `components/sections/testimonials-section.tsx`
- `components/sections/reservations-section.tsx`

`app/page.tsx` composes these sections in the authoritative order and contains no stateful business logic.

### Interaction components

- `components/menu/menu-browser.tsx`: filters typed menu fixtures and renders count, results, and empty state.
- `components/testimonials/testimonial-carousel.tsx`: explicit previous/next controls, live status, CSS scroll snap, and touch support without drag-only dependence.
- `components/reservations/reservation-form.tsx`: owns reservation field state and presentation.
- `components/reservations/event-enquiry-form.tsx`: owns a separate event-enquiry field model and presentation.
- `components/reservations/prototype-result.tsx`: shared, typed presentation for simulated success or failure without conflating the two workflows.

Shared primitives are extracted only when at least three consumers share the same visual or behavioural pattern, except where shadcn already supplies the canonical primitive.

## Data model and fixture boundary

`lib/types.ts` defines menu, gallery, testimonial, navigation, restaurant-detail, form-value, validation-error, and prototype-result types. Typed fixtures live under `lib/constants/` and presentation components import them directly.

Menu fixtures include stable IDs, name, description, price in BDT, category, dietary tags, spice level, availability, feature state, image, and image alternative text. No interface uses `any`.

Mock form work lives outside presentation components in focused modules under `lib/prototypes/`. Each handler accepts typed values and returns a discriminated union such as `success | validation-error | simulated-error`. The implementation can use deterministic fixture conditions so every state can be verified without random flaky behaviour. A later server handler can replace this boundary without redesigning the form.

## Interaction and state contracts

### Menu filters

- Category, dietary preference, spice level, and availability operate only on verified fixture properties.
- Changing filters updates results immediately and announces the result count.
- “Clear filters” restores the full menu and returns focus predictably.
- Filter controls use buttons, checkboxes, or a maintained accessible select based on the number and semantics of choices; ARIA tabs are not used for ordinary filtering.

### Forms

- Forms use `noValidate` and application-owned validation.
- Every field has a programmatic label and stable help/error region.
- Submission focuses or scrolls to the first invalid field.
- Entered values survive validation and simulated server-style failures.
- Submit buttons preserve geometry while busy and prevent duplicate submission.
- Success and error results are announced through appropriate live regions.
- Reset returns to an empty form and restores focus to the first field.
- The prototype disclosure remains visible before submission and is repeated in success output.

### Automatic movement

- The marquee has a persistent pause/resume control.
- Reduced motion renders it static by default.
- Testimonials never advance automatically.
- No essential content is revealed only through hover, drag, or animation.

## Responsive behaviour

- **340–767px:** single-column hero; image follows primary copy; mobile navigation; horizontal signature rail; horizontally scrollable filter row where needed; two-column gallery only when image measures remain usable; stacked forms.
- **768–1023px:** two-column sections only where copy measure and touch targets remain comfortable; tablet navigation remains explicit; no compressed four-column card layouts.
- **1024px and above:** twelve-column editorial grid with intentional asymmetry and off-centre Ember Seam.
- **Short-height viewports:** hero remains content-driven rather than locked to `100vh`; navigation and primary actions stay reachable without cropped copy.
- **Large desktop:** content width stops growing at the design token maximum; imagery may bleed within controlled full-width bands without stretching body text.

Anchor targets use scroll margin so the sticky header does not obscure headings. Global owned scrollbars remain visible, themed, and stable. Safe overflow is local to rails and galleries; the page shell does not hide focus indicators or clip content.

## Accessibility requirements

- Target WCAG 2.2 AA.
- Use semantic landmarks and a logical heading hierarchy.
- Include a skip link and visible focus treatment.
- Meet contrast requirements in dark and bone surface combinations.
- Keep pointer targets touch friendly and all actions keyboard operable.
- Give every meaningful image accurate alternative text; decorative Ember Seam elements are hidden from assistive technology.
- Mobile navigation and any form overlay use an accessible shadcn primitive with title, focus management, Escape support, and focus restoration.
- Preserve password-manager and paste behaviour where applicable; no fields in this milestone collect passwords.
- At 200% zoom, content reflows without two-dimensional page scrolling.

## Imagery and performance

The repository has no final restaurant photography or transparent production logo. Existing approved remote patterns may supply provisional editorial photography during this milestone, but every fixture records its provisional status. The layout must allow one-to-one replacement with local restaurant assets later.

All images use `next/image`, explicit dimensions or stable aspect ratios, meaningful `sizes`, and intentional crops. Only the hero image is an LCP candidate. Below-the-fold images lazy-load. No autoplay video, canvas particle field, or smooth-scroll dependency is introduced.

## Dependencies and shadcn use

Before component implementation, inspect current shadcn project information and official documentation. Prefer generated shadcn primitives for Button, Field, Input, Textarea, Select where an authored popup is required, Sheet or Dialog for mobile/event overlays, and accessible feedback primitives.

`components.json` configures Lucide, but `lucide-react` is currently absent. Add it only through the component workflow or as a directly justified dependency. Accept no unrelated registry, theme, or configuration changes. Do not add Motion or Framer Motion.

## File-change boundary

Expected changes:

- Create or maintain `DESIGN.md`.
- Rebuild `app/page.tsx` and reconcile `app/globals.css` with the documented token and scrollbar system.
- Preserve the existing `next/font` setup in `app/layout.tsx`, changing metadata only if required by the accepted copy.
- Add focused layout, section, menu, testimonial, and reservation components.
- Add `lib/types.ts`, typed fixture modules under `lib/constants/`, and deterministic mock handlers under `lib/prototypes/`.
- Retire `components/hero-food-selector.tsx` and `components/heritage-menu.tsx` after their replacement is verified.
- Update `package.json`, `package-lock.json`, or `components.json` only when the approved shadcn primitives require it.

Do not modify unrelated documentation or introduce backend, authentication, database, email, ordering, payment, or admin files.

## Implementation sequence

1. Reconcile global tokens, typography mapping, scrollbars, focus, containers, and stable anchor behaviour.
2. Build navigation, footer, and the static single-page section shell.
3. Add typed fixtures and render every static section.
4. Implement menu filtering and empty/count states.
5. Implement testimonial controls.
6. Implement reservation and event prototypes with their complete state models.
7. Verify and refine responsive composition before adding scroll animation.
8. Add only the approved restrained GSAP enhancement, then repeat reduced-motion and performance checks.
9. Remove superseded components and dead styles after replacements pass verification.

Each slice should be independently reviewable and keep lint, type-check, and build green.

## Verification strategy

Run after each relevant slice and again at completion:

- `npm run lint`
- `npm run type-check`
- `npm run build`
- Frontend Design Premium strict project audit and `DESIGN.md` lint.
- Static search for native dialogs, non-semantic click targets, raw component colours, uncancelled automatic movement, duplicate primitives, and missing interaction states.

Browser verification covers:

- 340px, 375px, 768px, 1024px, 1280px, 1440px, 1920px, a short-height laptop, and a landscape phone.
- First viewport and full scroll, including accurate anchor navigation.
- Mobile menu open/close, Escape, focus containment, and restoration.
- Every menu filter combination, count announcement, clear action, and empty state.
- Testimonial pointer, keyboard, and touch controls.
- Reservation and event validation, pending, deterministic error, success, and reset states.
- Reduced motion, 200% zoom, keyboard-only navigation, focus visibility, image loading, and layout stability.
- Visual comparison against the approved Ember Seam concept for section order, type, palette, image hierarchy, spacing, restraint, and single-signature execution.

## Acceptance criteria

- All authoritative homepage sections exist in the required order and every navigation anchor reaches the correct section.
- No public UI implies ordering, delivery, payment, favourites, cart state, production reservation, or real enquiry delivery.
- Menu, gallery, testimonial, restaurant, navigation, and prototype results come from typed fixtures or typed handlers rather than embedded presentation data.
- Menu filters and both forms create meaningful, accessible local UI state.
- Prototype disclosures are visible and success messages explicitly say no request was sent or stored.
- The static layout is deliberate from 340px to 1920px and on short-height screens.
- The Ember Seam remains the single memorable effect; surrounding components stay quiet and coherent.
- Keyboard, touch, focus, reduced-motion, contrast, and layout-stability requirements pass browser review.
- Lint, type-check, production build, premium audit, and DESIGN.md lint complete without blocking findings.

## Known limitations

- Menu facts, prices, dietary claims, testimonials, hours, location details, map position, social links, logo quality, and photography remain provisional until the restaurant supplies verified content and assets.
- Forms deliberately do not persist or transmit data.
- Production availability, booking workflows, email, authentication, admin tools, ordering, delivery, and payments remain deferred milestones.
