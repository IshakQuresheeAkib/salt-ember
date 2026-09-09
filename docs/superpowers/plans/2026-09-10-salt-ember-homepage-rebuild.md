# Salt & Ember Homepage Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Salt & Ember homepage as the complete, responsive, accessible Ember Seam experience with typed fixtures and honest local interaction prototypes.

**Architecture:** `app/page.tsx` remains a Server Component that composes focused section components. Typed fixtures and deterministic prototype handlers live in `lib/`; browser state is isolated to mobile navigation, marquee controls, menu filtering, testimonial controls, and the two forms. Tailwind v4 semantic tokens in `app/globals.css` remain the runtime visual source, mirrored by `DESIGN.md`.

**Tech Stack:** Next.js 16.3.4 App Router, React 19.2.8, strict TypeScript 5.9.3, Tailwind CSS 4.3.3, shadcn 4.21.0 Base Nova, Lucide, Vitest, Testing Library, GSAP 3.15.0 after the static-layout approval gate.

**Spec:** `docs/superpowers/specs/2026-09-10-salt-ember-homepage-redesign-design.md`

## Global Constraints

- Keep this milestone frontend-only: no backend, Supabase, authentication, admin, persistence, EmailJS, ordering, delivery, payment, loyalty, or account behaviour.
- Preserve the canonical token names and values from `PROJECT_CONTEXT.md`; do not add palette aliases or raw component colours.
- Preserve the exact approved section order and visible copy from the specification.
- Use Server Components by default and keep browser-dependent client boundaries focused.
- Use typed local fixtures; restaurant facts, menu content, prices, dietary claims, reviews, hours, location details, logo, and photography remain visibly provisional.
- Both forms must state that no booking or enquiry was sent or stored.
- Build static responsive composition before enabling GSAP. Do not add Motion or Framer Motion.
- Target WCAG 2.2 AA from 340px through 1920px, including short-height, landscape-phone, keyboard, touch, 200% zoom, and reduced-motion states.
- Run `npm run lint`, `npm run type-check`, and `npm run build`; never use removed `next lint`.
- Commit each independently reviewable task on `codex/homepage-rebuild` after its focused checks pass.

---

## File Structure

### Runtime composition

- `app/layout.tsx` — fonts, metadata, and root document language.
- `app/page.tsx` — server-only section composition and skip-link target.
- `app/globals.css` — Tailwind v4 token mapping, global accessibility/scrollbar baseline, Ember Seam layout system, and component recipes.

### Layout and sections

- `components/layout/navbar.tsx` — desktop shell plus client mobile-navigation boundary.
- `components/layout/mobile-navigation.tsx` — shadcn Sheet state and anchor-close behaviour.
- `components/layout/footer.tsx` — contact, hours, social links, provisional notice, and copyright.
- `components/sections/hero-section.tsx` — single LCP image and approved hero copy/actions.
- `components/sections/marquee-strip.tsx` — paused/reduced-motion-aware moving strip.
- `components/sections/signature-dishes.tsx` — featured fixture rail.
- `components/sections/about-section.tsx` — story and primary portrait image.
- `components/sections/menu-section.tsx` — static heading/notice around the client menu browser.
- `components/sections/gallery-section.tsx` — image mosaic.
- `components/sections/testimonials-section.tsx` — static heading around the client carousel.
- `components/sections/reservations-section.tsx` — reservation and private-event composition.
- `components/shared/section-heading.tsx` — shared heading structure used by at least three sections.

### Stateful islands

- `components/menu/menu-browser.tsx` — menu filters, result count, clear action, and results.
- `components/testimonials/testimonial-carousel.tsx` — explicit previous/next controls and CSS-scroll-snap track.
- `components/reservations/reservation-form.tsx` — table-reservation form state and focus recovery.
- `components/reservations/event-enquiry-form.tsx` — separate private-event form state and focus recovery.
- `components/reservations/prototype-result.tsx` — shared result announcement presentation.
- `components/ui/*` — only shadcn-generated primitives required by the above compositions.

### Domain and fixtures

- `lib/types.ts` — all public fixture, filter, form, validation, and result types.
- `lib/constants/nav.ts` — anchor navigation.
- `lib/constants/menu.ts` — typed sample menu and categories.
- `lib/constants/gallery.ts` — typed image fixtures.
- `lib/constants/testimonials.ts` — typed provisional review fixtures.
- `lib/constants/restaurant.ts` — typed contact, hours, hero/about image, and social fixtures.
- `lib/prototypes/menu.ts` — pure menu filtering.
- `lib/prototypes/reservations.ts` — pure validation and deterministic prototype submission handlers.

### Tests

- `vitest.config.ts` — jsdom, aliases, and setup.
- `tests/setup.ts` — jest-dom and a stable `next/image` test adapter.
- `tests/fixtures.test.ts` — fixture integrity and prohibited-scope assertions.
- `tests/homepage-contract.test.tsx` — sections, anchor targets, approved copy, and no commerce affordances.
- `tests/navigation-marquee.test.tsx` — mobile menu and pause/resume behaviour.
- `tests/menu-browser.test.tsx` — pure filtering and UI state.
- `tests/testimonial-carousel.test.tsx` — explicit navigation and status.
- `tests/reservation-prototypes.test.ts` — validation and deterministic handler results.
- `tests/reservation-forms.test.tsx` — field errors, busy state, result disclosure, and reset.

---

### Task 1: Test Harness and Typed Content Boundary

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/fixtures.test.ts`
- Create: `lib/types.ts`
- Create: `lib/constants/nav.ts`
- Create: `lib/constants/menu.ts`
- Create: `lib/constants/gallery.ts`
- Create: `lib/constants/testimonials.ts`
- Create: `lib/constants/restaurant.ts`

**Interfaces:**
- Consumes: Canonical categories, section anchors, provisional-content rules, and visual copy from the approved specification.
- Produces: `MenuItem`, `MenuCategory`, `DietaryTag`, `GalleryItem`, `Testimonial`, `NavItem`, `RestaurantDetails`, `ReservationValues`, `EventEnquiryValues`, `FieldErrors<T>`, `PrototypeResult`, and typed fixture arrays used by every later task.

- [ ] **Step 1: Install the focused test harness**

Run:

```powershell
npm install --save-dev --save-exact vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Add scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts` with `environment: "jsdom"`, `setupFiles: ["./tests/setup.ts"]`, and alias `@` to the repository root. In `tests/setup.ts`, import `@testing-library/jest-dom/vitest`, run DOM cleanup after every test, stub `Element.prototype.scrollIntoView`, and mock `next/image` as a native image while removing `priority`, `fill`, and `unoptimized` props.

- [ ] **Step 2: Write the failing fixture-contract test**

Create `tests/fixtures.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { galleryItems } from "@/lib/constants/gallery";
import { menuItems } from "@/lib/constants/menu";
import { navItems } from "@/lib/constants/nav";
import { restaurantDetails } from "@/lib/constants/restaurant";
import { testimonials } from "@/lib/constants/testimonials";

describe("public fixture contract", () => {
  it("uses unique homepage anchors and no commerce destinations", () => {
    expect(navItems.map((item) => item.href)).toEqual([
      "#top",
      "#about",
      "#menu",
      "#gallery",
      "#reservations",
      "#contact",
    ]);
    expect(new Set(navItems.map((item) => item.href)).size).toBe(navItems.length);
  });

  it("keeps menu data typed, provisional, and denominated in BDT", () => {
    expect(menuItems.length).toBeGreaterThanOrEqual(8);
    expect(menuItems.every((item) => Number.isInteger(item.priceBdt))).toBe(true);
    expect(menuItems.every((item) => item.isProvisional)).toBe(true);
    expect(menuItems.some((item) => item.isFeatured)).toBe(true);
  });

  it("gives all public imagery meaningful alternative text", () => {
    expect(galleryItems.every((item) => item.alt.trim().length > 0)).toBe(true);
    expect(menuItems.every((item) => item.alt.trim().length > 0)).toBe(true);
  });

  it("marks unverified restaurant and testimonial content", () => {
    expect(restaurantDetails.isProvisional).toBe(true);
    expect(testimonials.every((item) => item.isProvisional)).toBe(true);
  });
});
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm run test -- tests/fixtures.test.ts`

Expected: FAIL because the `lib/types.ts` and `lib/constants/*` modules do not exist.

- [ ] **Step 4: Implement types and fixtures**

Define the core menu contract in `lib/types.ts`:

```ts
export const menuCategories = [
  "starters",
  "mains",
  "grills",
  "sides",
  "desserts",
  "drinks",
] as const;

export type MenuCategory = (typeof menuCategories)[number];
export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "halal"
  | "spicy"
  | "gluten-free";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceBdt: number;
  category: MenuCategory;
  image: string;
  alt: string;
  tags: DietaryTag[];
  spiceLevel: 0 | 1 | 2 | 3;
  isAvailable: boolean;
  isFeatured: boolean;
  isProvisional: true;
}
```

Add the remaining named interfaces from the task’s Produces list. Use stable IDs, Bangladesh-style phone formatting, integer BDT prices, existing allowed Unsplash hosts, accurate image descriptions, and explicit `isProvisional: true` values. `navItems` must match the exact href array in the failing test.

- [ ] **Step 5: Run focused and structural checks**

Run:

```powershell
npm run test -- tests/fixtures.test.ts
npm run type-check
npm run lint
```

Expected: all commands exit 0 with four fixture tests passing.

- [ ] **Step 6: Commit the content boundary**

```powershell
git add package.json package-lock.json vitest.config.ts tests/setup.ts tests/fixtures.test.ts lib/types.ts lib/constants
git commit -m "test: establish typed homepage fixtures"
```

---

### Task 2: Static Ember Seam Homepage

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `components/shared/section-heading.tsx`
- Create: `components/layout/navbar.tsx`
- Create: `components/layout/footer.tsx`
- Create: `components/sections/hero-section.tsx`
- Create: `components/sections/marquee-strip.tsx`
- Create: `components/sections/signature-dishes.tsx`
- Create: `components/sections/about-section.tsx`
- Create: `components/sections/menu-section.tsx`
- Create: `components/sections/gallery-section.tsx`
- Create: `components/sections/testimonials-section.tsx`
- Create: `components/sections/reservations-section.tsx`
- Create: `tests/homepage-contract.test.tsx`

**Interfaces:**
- Consumes: Typed fixtures from Task 1 and canonical CSS values from `DESIGN.md`.
- Produces: A complete semantic static homepage, stable section IDs, section components, `.content-shell`, `.section-shell`, `.section-heading`, `.ember-seam`, and button/link recipes used by later client islands.

- [ ] **Step 1: Write the failing homepage contract test**

Create `tests/homepage-contract.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("homepage contract", () => {
  it("renders every approved section and action", () => {
    const { container } = render(<Home />);
    for (const id of ["top", "about", "menu", "gallery", "reservations", "contact"]) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { level: 1, name: "Flavour meets fire." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the menu" })).toHaveAttribute("href", "#menu");
    expect(screen.getAllByRole("link", { name: "Reserve a table" })[0]).toHaveAttribute("href", "#reservations");
  });

  it("does not expose ecommerce language", () => {
    render(<Home />);
    expect(screen.queryByText(/order now|cart|shop|delivery|favourite/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test -- tests/homepage-contract.test.tsx`

Expected: FAIL because the current page lacks the approved sections and still renders ecommerce language.

- [ ] **Step 3: Implement the server composition and static sections**

Replace `app/page.tsx` with this composition shape:

```tsx
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <MarqueeStrip />
        <SignatureDishes />
        <AboutSection />
        <MenuSection />
        <GallerySection />
        <TestimonialsSection />
        <ReservationsSection />
      </main>
      <Footer />
    </>
  );
}
```

Implement every listed component with the exact heading/copy and order from the specification. Use `next/image` with stable width/height, `sizes`, and `priority` only for the hero image. Keep static sections server-rendered. Render real content without inert interaction controls: a static menu list, a testimonial list, and reservation/event explanations are replaced by their functional islands in Tasks 3–7. Do not render fake success messages in the static state.

- [ ] **Step 4: Replace global styles with the runtime design foundation**

In `app/globals.css`, expose every canonical colour to Tailwind v4:

```css
@theme inline {
  --font-heading: var(--font-display);
  --font-sans: var(--font-body);
  --color-ink: var(--ink);
  --color-charcoal: var(--charcoal);
  --color-ash: var(--ash);
  --color-bone: var(--bone);
  --color-smoke: var(--smoke);
  --color-ember: var(--ember);
  --color-chilli: var(--chilli);
  --color-amber: var(--amber);
  --color-deep-red: var(--deep-red);
  --radius-control: 0.625rem;
  --radius-panel: 1.25rem;
}
```

Add one global owned-scrollbar baseline, forced-colour fallback, skip-link, focus-visible treatment, stable anchor scroll margin, fluid content shell, responsive section rhythm, the twelve-column desktop grid, the mobile Ember Seam transformation, and a complete `prefers-reduced-motion` override. Component classes must consume variables or semantic Tailwind utilities rather than raw colours.

- [ ] **Step 5: Update metadata and run checks**

Keep Cormorant Garamond and Inter in `app/layout.tsx`; update only the title/description if needed to match the approved dine-in copy. Run:

```powershell
npm run test -- tests/homepage-contract.test.tsx
npm run type-check
npm run lint
npm run build
```

Expected: both homepage tests pass and all structural commands exit 0.

- [ ] **Step 6: Inspect the static page in a browser**

Run `npm run dev`, open `/`, and capture desktop 1440×900, mobile 375×812, and short-height 1280×720 screenshots. Confirm the hero has one focal image, the Ember Seam is the only expressive effect, the reservation field is the only light section, all copy is visible, and no horizontal page overflow occurs.

- [ ] **Step 7: Commit the static layout**

```powershell
git add app components/layout components/sections components/shared tests/homepage-contract.test.tsx
git commit -m "feat: rebuild static Ember Seam homepage"
```

---

### Task 3: Accessible Navigation and Marquee Controls

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `components.json` only if the shadcn CLI requires a schema update
- Create: `components/ui/button.tsx`
- Create: `components/ui/sheet.tsx`
- Create: `components/layout/mobile-navigation.tsx`
- Modify: `components/layout/navbar.tsx`
- Modify: `components/sections/marquee-strip.tsx`
- Create: `tests/navigation-marquee.test.tsx`

**Interfaces:**
- Consumes: `navItems`, shared action classes, and the static Navbar/Marquee compositions from Task 2.
- Produces: A focus-managed mobile Sheet and a marquee control with accessible names “Pause announcement” and “Resume announcement.”

- [ ] **Step 1: Write failing interaction tests**

```tsx
it("opens mobile navigation and closes after choosing About", async () => {
  const user = userEvent.setup();
  render(<Navbar />);
  await user.click(screen.getByRole("button", { name: "Open navigation" }));
  expect(screen.getByRole("dialog", { name: "Navigation" })).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "About" }));
  expect(screen.queryByRole("dialog", { name: "Navigation" })).not.toBeInTheDocument();
});

it("lets diners pause and resume the announcement strip", async () => {
  const user = userEvent.setup();
  render(<MarqueeStrip />);
  await user.click(screen.getByRole("button", { name: "Pause announcement" }));
  expect(screen.getByRole("button", { name: "Resume announcement" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm run test -- tests/navigation-marquee.test.tsx`

Expected: FAIL because the mobile Sheet and stateful marquee control do not exist.

- [ ] **Step 3: Confirm current official shadcn APIs and install primitives**

Review the current official Button and Sheet documentation for the Base Nova preset, then run:

```powershell
npx shadcn@4.21.0 add button sheet
```

Inspect `git diff` immediately. Keep only the generated primitives and their direct dependencies; reject palette, font, or unrelated global-style changes.

- [ ] **Step 4: Implement focused client interactions**

`MobileNavigation` owns `open` state and calls `setOpen(false)` on each anchor. It uses Sheet title “Navigation,” a visible close control, and the same `navItems` source as desktop. `MarqueeStrip` owns `paused` state, sets `data-paused`, and changes the button’s visible and accessible label between Pause and Resume. CSS uses `animation-play-state` and makes the strip static under reduced motion.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
npm run test -- tests/navigation-marquee.test.tsx
npm run type-check
npm run lint
```

Expected: both interaction tests pass with no accessibility or React warnings.

```powershell
git add package.json package-lock.json components.json components/ui components/layout components/sections/marquee-strip.tsx tests/navigation-marquee.test.tsx app/globals.css
git commit -m "feat: add accessible homepage navigation"
```

---

### Task 4: Menu Filtering and Results

**Files:**
- Create: `lib/prototypes/menu.ts`
- Create: `components/menu/menu-browser.tsx`
- Modify: `components/sections/menu-section.tsx`
- Modify: `app/globals.css`
- Create: `tests/menu-browser.test.tsx`

**Interfaces:**
- Consumes: `MenuItem`, `MenuCategory`, `DietaryTag`, and `menuItems`.
- Produces: `MenuFilters`, `initialMenuFilters`, `filterMenuItems(items, filters)`, and the accessible `MenuBrowser` client component.

- [ ] **Step 1: Write failing pure and UI tests**

```tsx
it("filters by category, dietary tag, spice ceiling, and availability", () => {
  const result = filterMenuItems(menuItems, {
    category: "grills",
    dietary: "halal",
    maximumSpice: 2,
    availableOnly: true,
  });
  expect(result.every((item) => item.category === "grills")).toBe(true);
  expect(result.every((item) => item.tags.includes("halal"))).toBe(true);
  expect(result.every((item) => item.spiceLevel <= 2 && item.isAvailable)).toBe(true);
});

it("clears an empty result and restores the full menu", async () => {
  const user = userEvent.setup();
  render(<MenuBrowser items={menuItems} />);
  await user.click(screen.getByRole("button", { name: "Desserts" }));
  await user.click(screen.getByLabelText("Available dishes only"));
  await user.click(screen.getByRole("button", { name: "Clear filters" }));
  expect(screen.getByText(`${menuItems.length} sample dishes`)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test -- tests/menu-browser.test.tsx`

Expected: FAIL because the filter function and browser do not exist.

- [ ] **Step 3: Implement the pure filter and browser**

Define:

```ts
export interface MenuFilters {
  category: MenuCategory | "all";
  dietary: DietaryTag | "all";
  maximumSpice: 0 | 1 | 2 | 3;
  availableOnly: boolean;
}

export const initialMenuFilters: MenuFilters = {
  category: "all",
  dietary: "all",
  maximumSpice: 3,
  availableOnly: false,
};
```

`filterMenuItems` applies all four constraints without mutating its input. `MenuBrowser` derives results during render, uses category buttons and labelled native controls where OS-owned popups are acceptable, announces the count with `aria-live="polite"`, exposes a clear action whenever filters differ from initial state, and renders the approved empty-state copy.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npm run test -- tests/menu-browser.test.tsx
npm run type-check
npm run lint
```

```powershell
git add lib/prototypes/menu.ts components/menu components/sections/menu-section.tsx app/globals.css tests/menu-browser.test.tsx
git commit -m "feat: add typed menu filtering"
```

---

### Task 5: Gallery and Testimonial Controls

**Files:**
- Create: `components/testimonials/testimonial-carousel.tsx`
- Modify: `components/sections/testimonials-section.tsx`
- Modify: `components/sections/gallery-section.tsx`
- Modify: `app/globals.css`
- Create: `tests/testimonial-carousel.test.tsx`

**Interfaces:**
- Consumes: `galleryItems` and `testimonials`.
- Produces: A non-automatic carousel with previous/next buttons, `aria-live` position text, CSS scroll snap, touch scrolling, and no drag-only dependency.

- [ ] **Step 1: Write and fail the navigation test**

```tsx
it("moves through provisional testimonials with explicit controls", async () => {
  const user = userEvent.setup();
  render(<TestimonialCarousel items={testimonials} />);
  expect(screen.getByText("Testimonial 1 of 3")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Next testimonial" }));
  expect(screen.getByText("Testimonial 2 of 3")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Previous testimonial" }));
  expect(screen.getByText("Testimonial 1 of 3")).toBeInTheDocument();
});
```

Run: `npm run test -- tests/testimonial-carousel.test.tsx`

Expected: FAIL because `TestimonialCarousel` does not exist.

- [ ] **Step 2: Implement carousel and gallery finishing**

Keep an integer active index in the client component. Buttons clamp at the first/last item and expose disabled state. Call `scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", inline: "start" })` after explicit control activation only. The gallery remains server-rendered, uses fixture-defined aspect roles, and does not hide captions or meaning behind hover.

- [ ] **Step 3: Verify and commit**

Run:

```powershell
npm run test -- tests/testimonial-carousel.test.tsx
npm run type-check
npm run lint
```

```powershell
git add components/testimonials components/sections/testimonials-section.tsx components/sections/gallery-section.tsx app/globals.css tests/testimonial-carousel.test.tsx
git commit -m "feat: add gallery and testimonial controls"
```

---

### Task 6: Reservation and Event Prototype Domain

**Files:**
- Create: `lib/prototypes/reservations.ts`
- Create: `tests/reservation-prototypes.test.ts`

**Interfaces:**
- Consumes: `ReservationValues`, `EventEnquiryValues`, `FieldErrors<T>`, and `PrototypeResult`.
- Produces: `validateReservation`, `validateEventEnquiry`, `submitReservationPrototype`, and `submitEventEnquiryPrototype`.

- [ ] **Step 1: Write failing validation and result tests**

```ts
it("returns field-specific reservation errors", () => {
  expect(validateReservation({
    name: "",
    email: "bad",
    phone: "",
    date: "",
    time: "",
    partySize: "",
    notes: "",
  })).toMatchObject({
    name: "Enter your name.",
    email: "Enter a valid email address.",
    phone: "Enter a phone number.",
    date: "Choose a date.",
  });
});

it("returns deterministic success and simulated failure", async () => {
  await expect(submitReservationPrototype(validReservation, 0)).resolves.toMatchObject({ status: "success", kind: "reservation" });
  await expect(submitReservationPrototype({ ...validReservation, email: "error@example.com" }, 0)).resolves.toMatchObject({ status: "error", kind: "reservation" });
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test -- tests/reservation-prototypes.test.ts`

Expected: FAIL because the prototype module does not exist.

- [ ] **Step 3: Implement deterministic handlers**

Validation trims string fields, validates email syntax, requires phone/date/time/party size for reservations, and requires name/email/phone/event type/guest count/message for events. Both submission functions accept an optional second `delayMs` parameter with a 450ms default; tests pass `0`, while the UI uses the default to expose a stable busy state. The reserved email `error@example.com` deterministically returns the approved correction message; all other valid input returns success. Neither handler performs network, storage, analytics, or logging.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npm run test -- tests/reservation-prototypes.test.ts
npm run type-check
npm run lint
```

```powershell
git add lib/prototypes/reservations.ts tests/reservation-prototypes.test.ts
git commit -m "feat: define reservation prototype contracts"
```

---

### Task 7: Reservation and Private-Event Forms

**Files:**
- Create: `components/ui/field.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/textarea.tsx`
- Create: `components/ui/select.tsx`
- Create: `components/reservations/prototype-result.tsx`
- Create: `components/reservations/reservation-form.tsx`
- Create: `components/reservations/event-enquiry-form.tsx`
- Modify: `components/sections/reservations-section.tsx`
- Modify: `app/globals.css`
- Create: `tests/reservation-forms.test.tsx`

**Interfaces:**
- Consumes: Validation/submission functions from Task 6 and shared shadcn Button from Task 3.
- Produces: Two distinct, complete form state machines and shared typed result presentation.

- [ ] **Step 1: Write failing UI tests**

```tsx
it("shows reservation errors and preserves entered values", async () => {
  const user = userEvent.setup();
  render(<ReservationForm />);
  await user.type(screen.getByLabelText("Name"), "Asha Rahman");
  await user.click(screen.getByRole("button", { name: "Reserve a table" }));
  expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  expect(screen.getByLabelText("Name")).toHaveValue("Asha Rahman");
});

it("announces honest simulated success and resets", async () => {
  const user = userEvent.setup();
  render(<ReservationForm />);
  await completeValidReservation(user);
  await user.click(screen.getByRole("button", { name: "Reserve a table" }));
  expect(await screen.findByText("This is a prototype — no booking was sent or stored.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Start another reservation" }));
  expect(screen.getByLabelText("Name")).toHaveValue("");
});
```

Add the equivalent event test with action “Send event enquiry” and disclosure “This is a prototype — no enquiry was sent or stored.”

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test -- tests/reservation-forms.test.tsx`

Expected: FAIL because the form components do not exist.

- [ ] **Step 3: Confirm official shadcn form APIs and generate primitives**

Review current official Field, Input, Textarea, and Select documentation. Run:

```powershell
npx shadcn@4.21.0 add field input textarea select
```

Inspect the diff and preserve the Salt & Ember token/font contract. Use native date and time inputs because operating-system-owned pickers are acceptable for this prototype. Use the authored Select only for controlled choice fields that need consistent listbox presentation.

- [ ] **Step 4: Implement both forms**

Each form uses `noValidate`, controlled typed values, `data-invalid` on Field, `aria-invalid` and existing `aria-describedby` IDs on controls, an `isSubmitting` guard, stable button dimensions, and a visible pre-submit prototype notice. Submission validates first, focuses the first invalid control via field-name refs, awaits the deterministic handler, and displays `PrototypeResult` in an appropriate live region. Reset restores initial values and focuses Name. Textareas set `resize: none` and have sufficient default height.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
npm run test -- tests/reservation-forms.test.tsx tests/reservation-prototypes.test.ts
npm run type-check
npm run lint
```

```powershell
git add package.json package-lock.json components.json components/ui components/reservations components/sections/reservations-section.tsx app/globals.css tests/reservation-forms.test.tsx
git commit -m "feat: add honest reservation prototypes"
```

---

### Task 8: Static Visual Acceptance, Accessibility, and Cleanup

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: affected `components/**/*.tsx`
- Delete: `components/hero-food-selector.tsx`
- Delete: `components/heritage-menu.tsx`
- Modify: `DESIGN.md` only if accepted runtime token values changed

**Interfaces:**
- Consumes: Complete static and interactive homepage from Tasks 1–7.
- Produces: A verified static-responsive release candidate and the human review gate for optional GSAP enhancement.

- [ ] **Step 1: Run the complete automated suite**

```powershell
npm run test
npm run lint
npm run type-check
npm run build
npx -p @google/design.md designmd lint DESIGN.md
python "C:\Users\Ishak Akib Quereshee\.codex\plugins\cache\openai-curated-remote\frontend-design-premium\1.4.0\skills\frontend-design-premium\scripts\audit_project.py" . --mode strict
```

Expected: every command exits 0. Fix blocking findings within the approved design and repeat the affected check.

- [ ] **Step 2: Search for forbidden and fragile patterns**

Run:

```powershell
rg -n "alert\(|confirm\(|prompt\(|onClick=.*<div|Order now|cart|delivery|favourite|#[0-9A-Fa-f]{3,8}" app components lib
```

Expected: no native dialogs, non-semantic clickable divs, ecommerce language, or raw component hex values. Canonical hex declarations may appear only in the token block in `app/globals.css`.

- [ ] **Step 3: Perform browser acceptance checks**

Verify 340×800, 375×812, 768×1024, 1024×768, 1280×720, 1440×900, 1920×1080, and landscape-phone viewports. Exercise all anchors, mobile navigation, filters, empty state, testimonial controls, both forms in validation/error/success/reset states, keyboard-only use, reduced motion, 200% zoom, and long content. Capture representative desktop/mobile/short-height screenshots and compare them to the spec and `DESIGN.md`.

- [ ] **Step 4: Remove superseded implementation**

Delete the two obsolete components only after `rg` confirms they have no imports. Remove their dead selectors from `app/globals.css`, rerun the complete automated suite, and inspect `git diff --check` plus `git diff --stat`.

- [ ] **Step 5: Commit the static release candidate**

```powershell
git add -A
git commit -m "refactor: retire superseded homepage layout"
```

- [ ] **Step 6: Present the static visual checkpoint**

Open the desktop and mobile result in Codex and ask for explicit approval before Task 9. Report any remaining provisional assets or browser limitations. Do not add GSAP until this approval is received.

---

### Task 9: Restrained GSAP Enhancement After Static Approval

**Files:**
- Create: `lib/gsap.ts`
- Create: `components/motion/homepage-motion.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `tests/homepage-motion.test.tsx`

**Interfaces:**
- Consumes: Approved static DOM targets and existing `gsap`/`@gsap/react` packages.
- Produces: One hero entrance and restrained image/Ember Seam sequences, with no motion below 768px or under reduced-motion preference.

- [ ] **Step 1: Write the failing motion-boundary test**

```tsx
it("keeps all content rendered without requiring animation", () => {
  render(<HomepageMotion><HeroSection /></HomepageMotion>);
  expect(screen.getByRole("heading", { name: "Flavour meets fire." })).toBeVisible();
});
```

Add a matchMedia test proving the wrapper creates no GSAP timeline when `(prefers-reduced-motion: reduce)` matches or viewport width is below 768px.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test -- tests/homepage-motion.test.tsx`

Expected: FAIL because the motion boundary and GSAP registration module do not exist.

- [ ] **Step 3: Implement the named motion boundary**

Register GSAP, ScrollTrigger, and `useGSAP` once in `lib/gsap.ts`. `HomepageMotion` renders children immediately, uses `gsap.matchMedia()` inside `useGSAP`, creates only the approved hero/seam/image transforms and opacity sequences at desktop widths, and relies on the hook’s context cleanup. It never animates layout properties, form controls, text needed for comprehension, or the same property owned by CSS.

- [ ] **Step 4: Verify motion and complete the branch**

Run the complete Task 8 automated and browser matrix again, including motion-on and reduced-motion screenshots. Confirm no new layout shift, long task, clipping, or short-height regression.

```powershell
git add lib/gsap.ts components/motion app/page.tsx app/globals.css tests/homepage-motion.test.tsx
git commit -m "feat: add restrained homepage motion"
```

Run `git status --short`, inspect the full branch diff against its merge base, and leave the worktree clean.
