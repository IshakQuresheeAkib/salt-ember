# Restaurant Menu Data Architecture & Structured SEO Implementation Plan

> **Status:** COMPLETED. Implemented with ponytail minimalism and best-practices.

**Goal:** Implement $0 zero-maintenance in-repo TypeScript menu data architecture with Schema.org `Menu` structured data cleanly integrated into Next.js App Router root layout.

**Architecture:** Maintain all 136 dishes, prices, and categories statically inside `lib/constants/food-menu-data.ts`. Dishes utilize Next.js built-in image optimization for local assets and Google CDN for external assets. A pure generator function (`lib/seo-schema.ts`) builds comprehensive Schema.org `Menu` structured data with `hasMenuSection` and `hasMenuItem` nodes, supporting both single `Offer` and range `AggregateOffer` price models, and resolving relative images to absolute URLs. Injected cleanly into `app/layout.tsx` `@graph`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.9, Node.js Test Runner (`node:test`).

**Spec:** `docs/superpowers/specs/2026-11-14-menu-data-storage-and-seo-design.md`

## Global Constraints

- No paid database, external API subscriptions, or pausing database services ($0 operating cost forever).
- Data remains 100% in repository with full TypeScript types (`FoodItem`, `FoodCategory`).
- Zero layout shift (CLS = 0) in food card image presentation.
- All tests pass via `npm test` (`node --test tests/*.test.mjs`).
- Strict anti-slop standard: no emojis anywhere in code, comments, or terminal output.

---

### Step 0: Test Suite Hardening & Hygiene
- [x] Guard offline execution for dev-server dependent tests (`tests/brand-palette.test.mjs`, `tests/hero-composition.test.mjs`, `tests/testimonial-section.test.mjs`).
- [x] Modernize `tests/testimonials-motion-lifecycle.test.mjs` to match current Framer Motion `useAnimationFrame` implementation.
- [x] Normalize placeholder prices in `lib/constants/food-menu-data.ts`:
  - `starter-bbq-chicken`: converted `"$17.00"` to `"550 TK"`
  - `main-bbq-chicken`: converted `"$17.00"` to `"650 TK"`

### Task 1: Structured Menu Schema Generator (`lib/seo-schema.ts`) & Unit Tests
- [x] **Step 1: Implement pure helper and generator functions in `lib/seo-schema.ts`**
  - Pure function `generateMenuStructuredData(categories, dishes, siteConfig)` accepting typed parameters with zero runtime external imports (avoiding Node ESM / TS config conflicts).
  - Robust `parseDishOffer(priceStr)` returning `Offer` for single prices and `AggregateOffer` (`lowPrice`, `highPrice`, `priceCurrency: "BDT"`) for range/portion prices.
  - `resolveAbsoluteImageUrl(image, siteUrl)` ensuring all Schema.org image URLs are crawlable absolute URIs.
  - Returns Schema.org `Menu` node with `@id: "${siteConfig.url}/#menu"`.
- [x] **Step 2: Create unit tests in `tests/seo-schema.test.mjs`**
  - Verifies single and multi-price parsing.
  - Verifies all 136 dishes parse without NaN or invalid prices.
  - Verifies absolute image resolution.
  - Verifies full Menu structured data serialization.
- [x] **Step 3: Run unit tests**
  - Result: 4 passing tests in `tests/seo-schema.test.mjs`.

### Task 2: Inject Menu JSON-LD into `app/layout.tsx` & SEO Verification Tests
- [x] **Step 1: Integrate `menuStructuredData` into `app/layout.tsx`**
  - Import `FOOD_CATEGORIES`, `FOOD_DISHES`, and `generateMenuStructuredData`.
  - Append `menuStructuredData` to `@graph` while keeping existing `Restaurant` entity and `hasMenu: "${siteConfig.url}/#menu"`.
- [x] **Step 2: Update SEO verification tests in `tests/seo.test.mjs`**
  - Verify layout includes `generateMenuStructuredData` and `menuStructuredData` in structuredData script.
- [x] **Step 3: Run SEO tests**
  - Result: PASS.

### Task 3: Verification & Quality Gates
- [x] **Step 1: Run full test suite**
  - `npm test`: 70 passing, 0 failing, 3 skipped (offline server guard).
- [x] **Step 2: TypeScript strict check**
  - `npm run type-check`: 0 type errors.
- [x] **Step 3: Next.js production build**
  - `npm run build`: Successful compilation and static page generation.
