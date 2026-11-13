# Design Document: Restaurant Menu Data Architecture & Structured SEO

## 1. Intent & Context
The client requires a completely free, zero-maintenance, high-performance solution to store and display restaurant menu items (dish name, description, category, price, badges, and food imagery) for the Salt & Ember restaurant website.

The architecture must guarantee:
- \$0 monthly/yearly operating cost forever.
- Zero risk of downtime or database suspension.
- Maximum web performance (instant TTFB, zero database cold-start latency).
- Google Rich Results eligibility for restaurant menus via Schema.org JSON-LD.

## 2. Evaluation of Approaches & Final Decision

### Option A: Supabase Free Tier (Rejected)
- **Architecture**: PostgreSQL database queried via Supabase JS SDK or REST API.
- **Drawbacks**:
  - **Inactivity Pausing**: Supabase pauses free-tier projects after 7 consecutive days of inactivity. Low traffic periods would cause the live menu to break with 500 errors until someone manually logs into app.supabase.com to click "Restore".
  - **Fragility**: Artificial keep-alive pings violate platform spirit and are subject to policy adjustments.
  - **Overhead**: Requires environment variable management, client credentials, and extra bundle weight for a static restaurant menu.

### Option B: MongoDB Atlas M0 Free Tier (Rejected)
- **Architecture**: Hosted NoSQL database queried through serverless functions.
- **Drawbacks**:
  - **Latency**: Establishing TLS connection pools from Next.js serverless runtimes (Netlify/Vercel) adds 300ms–800ms cold-start latency.
  - **Complexity**: Requires Mongoose/MongoDB driver, connection pooling logic, IP whitelist maintenance (`0.0.0.0/0`), and secrets handling.
  - **Cost/Benefit**: Massive over-engineering for a menu that updates occasionally.

### Option C: Type-Safe Code/Static Storage + Cloudinary CDN (Selected)
- **Architecture**: Maintain menu data directly in `lib/constants/food-menu-data.ts` (TypeScript) and serve optimized food images via Cloudinary CDN (`f_auto,q_auto`).
- **Benefits**:
  - **Cost**: \$0.00 forever.
  - **Reliability**: 100% uptime with zero databases to pause, sleep, or maintain.
  - **Performance**: 0ms database lookup time. Fully pre-rendered at build time (SSG) in Next.js App Router.
  - **Security**: Zero attack surface (no connection strings, no database credentials, no SQL/NoSQL injection).
  - **Developer Experience**: Full TypeScript autocomplete and compile-time validation for every dish property.

## 3. Architecture Specification

### 3.1 Data Layer (`lib/constants/food-menu-data.ts`)
- Use the existing `FoodItem` and `FoodCategory` TypeScript interfaces.
- Dish items specify `id`, `name`, `category`, `price`, `description`, `image`, and optional `portion`, `isPopular`, `isSpicy`.
- Remote image URLs utilize Cloudinary delivery with dynamic optimization flags (`f_auto,q_auto,w_600,c_fill,g_auto`).

### 3.2 Image Synchronization Workflow
- Provide a dedicated, manual on-demand CLI script: `scripts/upload-dishes-cloudinary.mjs`.
- The script:
  1. Inspects local dish images in `public/images/menu/**`.
  2. Uploads new or updated dish images to Cloudinary folder `salt-ember/dishes/`.
  3. Outputs a lookup table (`scripts/uploaded-dish-images.json`) containing the exact transformed secure URLs ready to use in `food-menu-data.ts`.
  4. Exposes an npm script: `npm run upload:dishes`.

### 3.3 Structured Data & SEO (`Restaurant` & `Menu` JSON-LD)
- Implement a dedicated JSON-LD generator function `lib/seo-schema.ts`.
- Emits Schema.org `Restaurant` with nested `hasMenu`:
  - `Menu`: Contains `hasMenuSection` for each `FoodCategory`.
  - `MenuSection`: Contains `hasMenuItem` for each `FoodItem`.
  - `MenuItem`: Includes `name`, `description`, `image`, and `offers` (`price`, `priceCurrency: "BDT"`).
- Injected cleanly as `<script type="application/ld+json">` in `app/page.tsx` or `app/layout.tsx`.

## 4. Non-Goals
- Building an authenticated customer ordering or payment checkout system.
- Introducing a self-hosted CMS or database container.
- Modifying the visual glassmorphism design of `FoodMenuCard`.

## 5. Constraints & Best Practices
- Images must use `next/image` with `remotePatterns` (already configured in `next.config.ts`).
- Zero layout shift (CLS = 0) with predefined aspect ratios and skeleton pulses.
- Must pass `npm run type-check` and `npm run test` without errors.
- Strict anti-slop standard: no emojis in code or console outputs.
