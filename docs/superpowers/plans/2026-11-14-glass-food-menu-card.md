# Glass Food Menu Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract `FoodMenuCard` into a standalone component (`components/food-menu-card.tsx`) with dark luxury glassmorphism styling and integrate it into `components/food-menu-section.tsx`.

**Architecture:** Create `components/food-menu-card.tsx` encapsulating dish rendering, dark glass backdrop filter (`backdrop-blur-xl`), translucent specular surface, ember glow hover state, high-contrast typography, and favorite toggling. Update `components/food-menu-section.tsx` to import and render `FoodMenuCard`. Verify with Node.js test runner suite.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Lucide React, Node.js Test Runner (`node:test`).

**Spec:** `docs/superpowers/specs/2026-11-14-glass-food-menu-card-design.md`

## Global Constraints

- Palette: Midnight Shadow (`#0b2228`), Silver Mist (`#e4e4e4`), Burnt Orange (`#e36414`).
- No emojis anywhere in code, comments, or output.
- Glass effect must use `backdrop-blur-xl`, translucent background, luminous borders, and subtle ember shadow.
- High contrast: Light text (`text-silver`, `text-muted-foreground`) on dark translucent card background.

## Review Focus

- Missing image fallback renders properly with brand initial/icon.
- Long dish names and portions do not overflow card bounds.
- Keyboard navigation and accessibility for favorite toggle button (aria-label, aria-pressed).
- Responsive image `sizes` attribute matches mobile and desktop viewports without layout shift.
- Touch target size for favorite button adheres to at least 44x44px.

---

### Task 1: Create Unit Test for FoodMenuCard and Glassmorphism

**Files:**
- Create: `tests/food-menu-card.test.mjs`
- Modify: `tests/food-categories-tabs.test.mjs`

**Interfaces:**
- Consumes: `components/food-menu-card.tsx`, `components/food-menu-section.tsx`
- Produces: Test suite validating standalone component extraction and glass effect classes.

- [ ] **Step 1: Write failing test in `tests/food-menu-card.test.mjs`**

```javascript
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("FoodMenuCard is an exported standalone component", async () => {
  const cardSource = await readSource("../components/food-menu-card.tsx");
  assert.match(cardSource, /export function FoodMenuCard/);
  assert.match(cardSource, /export interface FoodMenuCardProps/);
});

test("FoodMenuCard features dark luxury glassmorphism styling", async () => {
  const cardSource = await readSource("../components/food-menu-card.tsx");
  assert.match(cardSource, /backdrop-blur/);
  assert.match(cardSource, /border-white\//);
  assert.match(cardSource, /text-silver/);
  assert.doesNotMatch(cardSource, /text-neutral-900/);
});

test("FoodMenuSection imports FoodMenuCard as an external component", async () => {
  const sectionSource = await readSource("../components/food-menu-section.tsx");
  assert.match(sectionSource, /import \{ FoodMenuCard \} from ["']@\/components\/food-menu-card["']/);
  assert.doesNotMatch(sectionSource, /function FoodMenuCard\(/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/food-menu-card.test.mjs`
Expected: FAIL (cannot find `../components/food-menu-card.tsx`).

---

### Task 2: Implement Standalone Glass FoodMenuCard Component

**Files:**
- Create: `components/food-menu-card.tsx`

**Interfaces:**
- Consumes: `FoodItem` from `@/lib/constants/food-menu-data`
- Produces: `FoodMenuCard`, `FoodMenuCardProps`

- [ ] **Step 1: Implement `components/food-menu-card.tsx`**

Implement `FoodMenuCard` featuring:
- Glassmorphism: `backdrop-blur-xl bg-white/[0.03] border border-white/10 hover:border-orange/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(227,100,20,0.12)]`.
- Specular top highlight gradient (`before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent`).
- Circular cast iron plate with elevated garnish accents.
- Responsive image with `sizes="(max-width: 640px) 250px, (max-width: 1024px) 350px, 400px"`.
- High-contrast typography: `text-silver font-heading` dish title, `text-muted-foreground` description, and `text-silver` price.
- Accessible favorite button with `aria-pressed`, `aria-label`, and interactive ember active states.

- [ ] **Step 2: Verify `tests/food-menu-card.test.mjs` partially passes (component exists and has glass styles)**

Run: `node --test tests/food-menu-card.test.mjs`
Expected: First two tests PASS, third test FAILS until FoodMenuSection is updated.

---

### Task 3: Refactor FoodMenuSection to Consume External FoodMenuCard

**Files:**
- Modify: `components/food-menu-section.tsx`
- Modify: `tests/food-categories-tabs.test.mjs`

**Interfaces:**
- Consumes: `FoodMenuCard` from `@/components/food-menu-card`
- Produces: Cleaned `components/food-menu-section.tsx`

- [ ] **Step 1: Update `components/food-menu-section.tsx`**

- Import `FoodMenuCard` from `@/components/food-menu-card`.
- Remove inline `FoodMenuCard` and `FoodMenuCardProps` definitions.
- Keep `FoodMenuSection` rendering the dish grid cleanly with `<FoodMenuCard key={dish.id} dish={dish} />`.

- [ ] **Step 2: Update `tests/food-categories-tabs.test.mjs` for image sizes verification**

Ensure `tests/food-categories-tabs.test.mjs` verifies image assertions in `components/food-menu-card.tsx`.

- [ ] **Step 3: Run unit tests**

Run: `node --test tests/food-menu-card.test.mjs tests/food-categories-tabs.test.mjs`
Expected: All tests PASS.

- [ ] **Step 4: Type check with TypeScript compiler**

Run: `npm run type-check`
Expected: 0 errors.

---

### Task 4: Mechanical Quality Audit and Final Verification

**Files:**
- Inspect: `components/food-menu-card.tsx`
- Inspect: `components/food-menu-section.tsx`

- [ ] **Step 1: Run Impeccable design detector**

Run: `& "C:\Users\Ishak Akib Quereshee\.gemini\config\skills\impeccable\scripts\impeccable.cmd" detect --json components/food-menu-card.tsx components/food-menu-section.tsx`
Expected: 0 critical design flaws.

- [ ] **Step 2: Run complete test suite and build verification**

Run: `npm run build`
Expected: Clean build with 0 errors.
