# Salt & Ember

> **Current implementation reference.** This file describes the repository as it exists in the working tree. It is the intended single reference for project scope, design system, architecture, and engineering rules. It does **not** establish that any restaurant claim, menu item, image, testimonial, contact detail, or external profile has been approved for publication.

## 1. Product

Salt & Ember is a single-page, frontend-only restaurant website built for a Sylhet, Bangladesh concept. The application has one public route: `/`.

### What the page currently provides

- Header navigation to Home, Menu, Reviews, and Contact.
- A desktop navigation bar, a Google Maps link, and a native `<details>` mobile menu.
- A hero with a selectable four-item food orbit, automatic rotation, and a pause/resume control.
- A client-side menu filter with eight hard-coded items in All, Dishes, Platter, Drinks, and Dessert categories.
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

| Token | Current value | Intended role |
| --- | --- | --- |
| `--silver-mist` | `#E4E4E4` | primary light text and focus outline |
| `--flameburst-orange` | `#DA500B` | emphasis, active controls, rules, and heat |
| `--midnight-shadow` | `#050505` | page canvas and dark text on light controls |
| `--surface` | derived with `color-mix()` | raised dark surface |
| `--muted-foreground` | derived with `color-mix()` | secondary text |

Tailwind v4 maps these runtime variables to `background`, `foreground`, `card`, `border`, `primary`, `muted-foreground`, `silver-mist`, `flameburst-orange`, `surface`, and `midnight-shadow` utilities.

### Typography

- `Cormorant Garamond` is loaded as `--font-display`.
- `Inter` is loaded as `--font-body` and is the document sans font.
- `DynaPuff` is also loaded as `--font-dynapuff`.
- Hero and section heading source currently uses `font-[family-name:var(--font-title)]`; any change to display-type behaviour must verify the corresponding token in `app/globals.css` and the browser output.

### Responsive composition

The shared page gutter is `clamp(16px, 4.5vw, 112px)`, and content shells use a maximum width of 2200px. Key source breakpoints are 480px, 704px, 800px/801px, and 1120px.

- Below 801px, the hero becomes a single-column layout and the `<details>` navigation is used.
- At 704px, the menu grows from two to three columns; at 1120px, it grows to four.
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
  hero-food-selector.tsx         # hero selection, autoplay, GSAP orbit
  menu.tsx                       # client-side category filter and cards
  testimonials.tsx               # Framer Motion or reduced-motion testimonials
  footer.tsx                     # contact and social presentation
  ui/
    social-media.tsx             # social/call controls and tooltips
    text-block-animation.tsx     # GSAP/SplitText line reveal
lib/
  gsap.ts                        # one-time GSAP plugin and ease registration
  hero-food-autoplay-state.mts   # pure autoplay state rules
  constants/                     # social and testimonial fixtures
  types.ts, utils.ts             # shared types and utilities
tests/                           # focused Node test files
public/
  logo.webp                      # header logo asset
```

### Rendering and client boundaries

`app/page.tsx` is server-rendered by default and composes the hero, menu, testimonials, and footer. Client components are limited to interaction and browser APIs:

- `hero-food-selector.tsx` observes reduced motion, document visibility, pointer/focus state, geometry, and drives GSAP transitions.
- `menu.tsx` stores the selected category and keeps the outgoing grid mounted during its 180ms crossfade.
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
- map-pin and hero-icon keyframe effects;
- runtime elements inserted by GSAP line reveals;
- hero clipping, orbit geometry, SVG path styling, and desktop/mobile placement;
- bracket-title pseudo-elements;
- menu crossfade entry/exit state;
- layered `color-mix()` card shadows and testimonial mask;
- reduced-motion overrides.

Do not move those rules merely to make the stylesheet smaller. Prefer Tailwind for normal component-local presentation; retain CSS for generated pseudo-elements, complex geometry, custom properties, and multi-layer visual effects.

## 5. Interaction, motion, and accessibility contracts

### Navigation and controls

- Navigation targets are `#top`, `#menu`, `#testimonials`, and `#contact`.
- The mobile menu remains native `<details>`/`<summary>` markup.
- Hero food and menu category controls are native buttons using `aria-pressed`.
- Social links have accessible labels. Decorative remote social icons and hero food images are hidden from the accessible name calculation.
- The shared `:focus-visible` treatment is a two-pixel Silver Mist outline with a four-pixel offset.

### Hero orbit

- The four selectable states are Dishes, Dessert, Drinks, and Platter.
- Automatic rotation waits 800ms between selections.
- Rotation is not scheduled while the page is hidden, the hero is pointer-hovered, reduced motion is enabled, or the visitor has paused it.
- Keyboard-visible focus pauses rotation; the explicit toggle can resume it.
- Manual selections update a polite live region.
- GSAP owns food-path transitions and title/section line reveals. `MotionPathPlugin`, `ScrollTrigger`, `SplitText`, and two custom eases are registered in `lib/gsap.ts`.

### Testimonials and reduced motion

- Motion-capable presentation continuously translates three testimonial columns, with nine primary cards and visually repeated cards for the loop.
- Repeated cards are marked `aria-hidden`.
- Under `prefers-reduced-motion`, Framer Motion is configured for user preference and all nine testimonials render as a static list.
- Global reduced-motion CSS removes non-essential transition and animation duration; hero selection falls back to a fade instead of the path movement.

No content or control may depend on animation completing successfully.

## 6. Content ownership

The following values are implementation fixtures or external links and should be changed only as an approved, coherent content update:

- food state images and menu data in `components/hero-food-selector.tsx` and `components/menu.tsx`;
- testimonial copy, names, roles, and images in `lib/constants/testimonials.ts`;
- phone, WhatsApp, Facebook, and Instagram links in `lib/constants/social-media.ts`;
- location/map link in `components/header.tsx` and `components/footer.tsx`;
- page title and description in `app/layout.tsx`.

Keep shared contact data in its constants module where possible; do not create divergent phone or social values in presentation components.

## 7. Engineering rules

- Preserve the server-first architecture. Add a client boundary only for state, effects, animation, or browser APIs.
- Use `next/image` with dimensions, useful alternative text for meaningful imagery, and empty alternative text for decorative imagery.
- Keep GSAP and Framer Motion responsible for separate elements and properties.
- Preserve stable keys and ensure leaving menu content is hidden from assistive technology during the crossfade.
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

- all four navigation anchors and the mobile disclosure menu;
- hero selection, pause/resume state, hover/focus behaviour, and reduced motion;
- menu category changes and the temporary crossfade;
- testimonial motion and static reduced-motion output;
- keyboard focus visibility, no clipped controls, and image layout stability.

## 9. Documentation status

`PROJECT.md` replaces the prior project, product, design, docs, and plan documents. It is the current implementation reference.
