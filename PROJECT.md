# Salt & Ember

> **Current implementation reference.** This file describes the repository as it exists in the working tree. It is the intended single reference for project scope, design system, architecture, and engineering rules. It does **not** establish that any restaurant claim, menu item, image, testimonial, contact detail, or external profile has been approved for publication.

## 1. Product

Salt & Ember is a single-page, frontend-only restaurant website built for a Sylhet, Bangladesh concept. The application has one public route: `/`.

### What the page currently provides

- Header navigation to Home, Menu, Reviews, and Contact.
- A desktop navigation bar, an external Google Maps hero CTA, and a fixed mobile bottom navigation bar.
- A hero with a selectable six-item food orbit and automatic rotation.
- A client-side, keyboard-operable carousel for 28 local menu-page images.
- A testimonial presentation: animated columns when motion is allowed, or a static grid when reduced motion is requested.
- A contact footer with a maps link, phone link, WhatsApp link, Facebook link, and Instagram link.

### Explicitly absent

There is no backend, database, authentication, CMS, analytics, form submission, reservation flow, event enquiry workflow, ordering, delivery, payment, map embed, persistence, or administration interface.

### Content and publication boundary

The code currently renders restaurant positioning, dishes, prices, testimonials, imagery, location, phone/WhatsApp details, and social destinations. Their business approval status cannot be verified from this repository. Treat all such values as implementation content that needs separate owner approval before a production release.

## 2. Brand and visual system

### Direction

The interface uses a dark, fire-led editorial direction. Its visual signature is an off-centre hero composition: copy on the left and a curved, animated food orbit on the right. The implementation uses close food photography, thin orange rules, circular image crops, dark surfaces, and rounded rectangular controls.

### Runtime tokens

`app/globals.css` owns the shared token layer. Components should use Tailwind token utilities or these variables, rather than introduce new hard-coded palette values.

| Token                | Current value              | Intended role                               |
| -------------------- | -------------------------- | ------------------------------------------- |
| `--silver`           | `#E4E4E4`                  | primary light text and focus outline        |
| `--orange`           | `#E36414`                  | emphasis, active controls, rules, and heat  |
| `--midnight-shadow`  | `#0B2228`                  | page canvas and dark text on light controls |
| `--surface`          | derived with `color-mix()` | raised dark surface                         |
| `--muted-foreground` | derived with `color-mix()` | secondary text                              |

Tailwind v4 maps these runtime variables to `background`, `foreground`, `card`, `border`, `primary`, `muted-foreground`, `silver`, `orange`, `surface`, and `midnight-shadow` utilities.

### Typography

- `Cormorant Garamond` is loaded as `--font-display`.
- `Inter` is loaded as `--font-body` and is the document sans font.
- `Yeon Sung` is loaded as `--font-title` for the hero and section headings.
- Hero and section heading source currently uses `font-[family-name:var(--font-title)]`; any change to display-type behaviour must verify the corresponding token in `app/globals.css` and the browser output.

### Responsive composition

The shared page gutter is `clamp(16px, 4.5vw, 112px)`, and content shells use a maximum width of 2200px. The project defines `mobile` below 480px, `tablet` below 801px, and `desktop` from 801px. Individual components use additional layout thresholds where needed.

- Below 801px, the hero becomes a single-column layout and the fixed bottom navigation is used.
- The menu carousel exposes three pages below 800px and five at 800px and above; its card sizing has additional 480px and 1440px thresholds.
- The reduced-motion testimonial grid becomes three columns at 801px and above.

## 3. Technical architecture

### Stack

- Next.js 16.3.4 with the App Router
- React 19.2.8
- TypeScript 5.9.3 in strict mode
- Tailwind CSS 4.3.3, with `tw-animate-css` and shadcn Tailwind CSS imports
- GSAP 3.15.0 and `@gsap/react` for hero and line-reveal motion
- Framer Motion 13.2.0 for testimonial column movement
- `next/image` for local and remote images
- Lucide React for interface icons

Exact installed versions are defined by `package.json` and the lockfile.

### Application structure

```text
app/
  layout.tsx                     # metadata, Google fonts, document classes
  page.tsx                       # one-page composition
  globals.css                    # token layer and CSS-only visual primitives
components/
  header.tsx                     # desktop/mobile navigation and maps link
  hero-section.tsx               # hero copy, calls to action, social links
  mobile-bottom-nav.tsx          # client-side restaurant navigation adapter
  hero-food-selector.tsx         # hero selection, autoplay, GSAP orbit
  menu.tsx                       # local menu-page fixture and carousel composition
  testimonials.tsx               # Framer Motion or reduced-motion testimonials
  footer.tsx                     # contact and social presentation
  ui/
    bottom-nav-bar.tsx           # reusable animated bottom navigation primitive
    button.tsx                   # typed link/button primitive
    card-carousel.tsx        # selectable, paginated menu-page carousel
    draw-random-underline.tsx    # GSAP/DrawSVG navigation underline
    social-media.tsx             # social/call controls and tooltips
    text-block-animation.tsx     # GSAP/SplitText line reveal
lib/
  card-carousel-layout.mts   # pure carousel geometry and responsive rules
  gsap.ts                        # one-time GSAP plugin and ease registration
  hero-food-autoplay-state.mts   # pure autoplay state rules
  constants/                     # social and testimonial fixtures
  types.ts, utils.ts             # shared types and utilities
tests/                           # focused Node test files
public/
  hero-food/                     # six local hero food images
  logo.webp                      # header logo asset
  menu-images/                   # 28 local menu-page images
```

### Rendering and client boundaries

`app/page.tsx` is server-rendered by default and composes the hero, menu, testimonials, and footer. Client components are limited to interaction and browser APIs:

- `hero-food-selector.tsx` observes reduced motion, document visibility, viewport geometry, and drives GSAP orbit transitions.
- `menu.tsx` supplies the local menu-page fixture. `card-carousel.tsx` owns the selected page, pagination, keyboard arrows, hover/focus layout, responsive visible-card count, and its reduced-motion behavior.
- `testimonials.tsx` reads the reduced-motion preference and drives the animated testimonial columns.
- `text-block-animation.tsx` uses GSAP `SplitText` only when the viewport is at least 768px wide and reduced motion is not requested.

### Images

Remote images are currently permitted only from:

- `images.unsplash.com`
- `hebbkx1anhila5yf.public.blob.vercel-storage.com`
- `cdn.21st.dev`

Any additional remote image source must be added to `next.config.ts` before it is used with `next/image`.

## 4. Styling architecture

The project has migrated most component layout, spacing, typography, responsive layout, states, and ordinary transitions from global CSS to Tailwind utility classes. The remaining `app/globals.css` rules are intentionally reserved for concerns that are less legible or impractical as utilities:

- token definitions, global selection, focus, link, and anchor-offset behaviour;
- map-pin, hero-icon, and carousel-arrow keyframe effects;
- runtime elements inserted by GSAP line reveals;
- hero clipping, orbit geometry, SVG path styling, and desktop/mobile placement;
- bracket-title pseudo-elements;
- layered `color-mix()` card shadows and testimonial mask;
- reduced-motion overrides.

Do not move those rules merely to make the stylesheet smaller. Prefer Tailwind for normal component-local presentation; retain CSS for generated pseudo-elements, complex geometry, custom properties, and multi-layer visual effects.

## 5. Interaction, motion, and accessibility contracts

### Navigation and controls

- Navigation targets are `#top`, `#menu`, `#testimonials`, and `#contact`; the separate hero location CTA opens Google Maps in a new tab.
- The mobile navigation uses labelled anchor controls in a fixed bottom bar.
- Hero food controls are native buttons using `aria-pressed`. Visible carousel pages are buttons with `aria-current` on the selected page; non-visible pages are hidden from the accessibility tree and tab order.
- Social links have accessible labels. Decorative remote social icons and hero food images are hidden from the accessible name calculation.
- The shared `:focus-visible` treatment is a two-pixel Silver Mist outline with a four-pixel offset.

### Hero orbit

- The six selectable states are Appetizer, Biriyani, Burger, Kebab, Pasta, and Pizza.
- Automatic rotation waits 500ms between selections.
- Rotation is not scheduled while the page is hidden or reduced motion is enabled.
- Hovering or focusing the food controls does not interrupt rotation.
- Manual selections update a polite live region.
- GSAP owns food-path transitions, carousel movement, navigation underlines, and title/section line reveals. `MotionPathPlugin`, `DrawSVGPlugin`, `ScrollTrigger`, `SplitText`, and two custom eases are registered in `lib/gsap.ts`.

### Testimonials and reduced motion

- Motion-capable presentation continuously translates three testimonial columns, with nine primary cards and visually repeated cards for the loop.
- Repeated cards are marked `aria-hidden`.
- Under `prefers-reduced-motion`, Framer Motion is configured for user preference and all nine testimonials render as a static list.
- Global reduced-motion CSS removes non-essential transition and animation duration; hero selection falls back to a fade instead of the path movement.

No content or control may depend on animation completing successfully.

## 6. Content ownership

The following values are implementation fixtures or external links and should be changed only as an approved, coherent content update:

- food state labels and image paths in `components/hero-food-selector.tsx`;
- menu-page filenames in `components/menu.tsx`, with the corresponding assets in `public/menu-images/`;
- testimonial copy, names, sources, and optional ratings in `lib/constants/testimonials.ts`;
- phone, map, WhatsApp, Facebook, and Instagram data in `lib/constants/social-media.ts`;
- page title and description in `app/layout.tsx`.


## 7. Engineering rules

- Preserve the server-first architecture. Add a client boundary only for state, effects, animation, or browser APIs.
- Use `next/image` with dimensions, useful alternative text for meaningful imagery, and empty alternative text for decorative imagery.
- Keep GSAP and Framer Motion responsible for separate elements and properties.
- Preserve stable keys and ensure non-visible carousel pages remain unavailable to pointer and keyboard interaction.
- Keep desktop and mobile anchor targets in sync when navigation changes.
- Do not add packages, services, external hosts, public product claims, or operational features without an explicit approved requirement.
- Preserve existing user work; do not commit, deploy, publish, or modify remote systems unless explicitly requested.

## 8. Local development and verification

### Commands

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run build
```

The repository has focused Node tests in `tests/` but no aggregate `test` script. Some tests fetch a running local server and use `HERO_BASE_URL` or `TESTIMONIAL_BASE_URL` when the default ports are unsuitable. Run the intended test file explicitly, for example:

```bash
node --test tests/hero-food-autoplay-state.test.mjs
```

### Browser verification for UI changes

Check at least a small mobile viewport and a desktop viewport. Verify:

- all four navigation anchors and the mobile bottom navigation;
- hero selection, automatic rotation, hover/focus behaviour, document visibility, and reduced motion;
- menu-page selection, pagination controls, keyboard arrows, hover/focus layout, and reduced motion;
- testimonial motion and static reduced-motion output;
- keyboard focus visibility, no clipped controls, and image layout stability.

## 9. Documentation status

`PROJECT.md` replaces the prior project, product, design, docs, and plan documents. It is the current implementation reference.
