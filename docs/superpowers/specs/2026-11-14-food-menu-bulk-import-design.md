# Design Document: One-Time Food Menu Bulk Import

## 1. Intent & Context
Salt & Ember requires a single, complete content migration to update restaurant dishes with accurate dish names, categories, descriptions, prices, badges (popular/spicy), portions, and circular-ready food photography served via Cloudinary.

Because menu changes occur rarely (once in the project lifecycle), building runtime infrastructure (admin portals, database connections, CMS services, authentication endpoints) is explicitly out of scope. The implementation must remain 100% static, \$0 operating cost, type-safe, and zero-maintenance.

## 2. Approach: One-Time Bulk Spreadsheet Export & Import Pipeline
- **Export Script (`scripts/export-menu-template.mjs`)**:
  - Reads existing 136 dishes from `lib/constants/food-menu-data.ts`.
  - Generates a prefilled, clean CSV file (`public/data/menu-template.csv` or `scratch/menu-template.csv`).
  - Contains headers: `id`, `name`, `category`, `price`, `description`, `portion`, `isPopular`, `isSpicy`, `imageUrl`.
- **Employee Workflow**:
  - Employee imports CSV into Google Sheets (or Excel).
  - Employee uploads edited transparent square food photos directly to Cloudinary folder `salt-ember/dishes/`.
  - Employee fills in new/updated prices, descriptions, and pastes the Cloudinary image URL into `imageUrl`.
  - Discontinued dishes are removed; new dishes are added as new rows.
- **Import & Validation Script (`scripts/import-food-menu.mjs`)**:
  - Reads the exported CSV.
  - Validates:
    - Unique non-empty IDs (slug format, e.g. `starter-chicken-wings`).
    - Valid category matching the 14 known IDs in `FOOD_CATEGORIES`.
    - Required fields (`name`, `price`, `description`, `category`).
    - Price string format (`<amount> TK`).
    - Valid `imageUrl` (`https://res.cloudinary.com/...` or empty/fallback).
  - Regenerates `FOOD_DISHES` in `lib/constants/food-menu-data.ts` in strict TypeScript format with proper indentation and typing.
  - Updates associated test assertions in `tests/food-categories-tabs.test.mjs` to expect Cloudinary URLs.
  - Runs type checking and builds.

## 3. The 14 Standard Categories
1. `starters`: Appetizers & Starters
2. `soups-noodles`: Soups & Noodles
3. `salads`: Salads
4. `beef-steaks`: Beef Steaks
5. `slow-cooked`: Slow-Cooked Meat
6. `main-courses`: Main Courses
7. `pasta-spaghetti`: Pasta & Spaghetti
8. `pizza`: Pizza
9. `thai-chinese`: Thai & Chinese
10. `kebabs-naan`: Kebabs & Naan
11. `biryani`: Biryani
12. `sides`: Side Dishes
13. `beverages`: Beverages
14. `desserts`: Desserts & Pastry

## 4. Goals & Non-Goals
- **Goals**:
  - Generate immediate starter CSV prefilled with 136 dishes so the employee can start immediately.
  - Provide a bulletproof Node.js validation and import script.
  - Ensure zero runtime bundle additions or database dependencies.
  - Keep Next.js static build speed and Schema.org SEO integration intact.
- **Non-Goals**:
  - No database (Supabase, Mongo, Firebase).
  - No authentication or `/admin` routes.
  - No automated background image processing scripts (employee handles image editing and direct Cloudinary upload).
