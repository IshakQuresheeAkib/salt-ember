# One-Time Food Menu Bulk Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide an automated export and validation-import script pipeline for a one-time full replacement of Salt & Ember's food menu data and Cloudinary image URLs via Google Sheets/CSV.

**Architecture:** An export script dumps the current 136 dishes into a structured CSV template for the employee to edit in Google Sheets and upload photos directly to Cloudinary. An import script parses the completed CSV, performs strict schema/category/URL validation, and regenerates `lib/constants/food-menu-data.ts`.

**Tech Stack:** Node.js (v20+), Next.js 16, TypeScript 5, Node Test Runner (`node:test`, `node:assert`).

**Spec:** `docs/superpowers/specs/2026-11-14-food-menu-bulk-import-design.md`

## Global Constraints

- Menu data must remain statically bundled inside `lib/constants/food-menu-data.ts`.
- No new runtime dependencies or backend databases.
- Image URLs must point to `https://res.cloudinary.com/` (or preserve valid existing fallbacks).
- Category IDs must strictly match the 14 valid IDs in `FOOD_CATEGORIES`.
- Zero type errors on `npm run type-check` and all test suites must pass on `npm run test`.
- Anti-slop: zero emojis in code, comments, or terminal outputs.

## Review Focus

- Malformed price strings (e.g. `550`, `550TK`, `BDT 550` vs expected `550 TK`): validator must normalize or reject.
- Unescaped commas and quotes in dish descriptions: CSV parser must handle multi-line and quoted fields cleanly without dropping columns.
- Duplicate or empty dish `id` values: validator must reject duplicate keys immediately before touching TypeScript files.
- Invalid category slugs (e.g. typos like `starter` instead of `starters`): validator must reject with exact allowed list.
- HTTP or non-Cloudinary image URLs: validator must require HTTPS Cloudinary URLs to prevent broken images.

---

### Task 1: Export Current 136 Dishes to CSV

**Files:**
- Create: `scripts/export-menu-template.mjs`
- Test: `tests/export-menu-template.test.mjs`

**Interfaces:**
- Consumes: `lib/constants/food-menu-data.ts` (`FOOD_DISHES`)
- Produces: `scratch/menu-template.csv` containing headers: `id,name,category,price,description,portion,isPopular,isSpicy,imageUrl`

- [ ] **Step 1: Write failing test for CSV export script**

```javascript
// tests/export-menu-template.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { execSync } from "node:child_process";

test("export-menu-template.mjs generates valid CSV containing 136 dishes", () => {
  const outputPath = path.resolve(process.cwd(), "scratch", "menu-template.csv");
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

  execSync("node scripts/export-menu-template.mjs", { stdio: "pipe" });

  assert.ok(fs.existsSync(outputPath), "CSV output file must exist");
  const content = fs.readFileSync(outputPath, "utf8");
  const lines = content.trim().split("\n");
  assert.equal(lines.length, 137, "Expected 1 header line + 136 dish rows");
  assert.match(lines[0], /^id,name,category,price,description,portion,isPopular,isSpicy,imageUrl/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/export-menu-template.test.mjs`  
Expected: FAIL with missing script `scripts/export-menu-template.mjs`.

- [ ] **Step 3: Implement `scripts/export-menu-template.mjs`**

Implement the script to import `FOOD_DISHES` from `lib/constants/food-menu-data.ts`, format values with proper CSV escaping (wrapping strings with quotes if they contain commas or quotes), and write to `scratch/menu-template.csv`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/export-menu-template.test.mjs`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/export-menu-template.mjs tests/export-menu-template.test.mjs scratch/menu-template.csv
git commit -m "feat(menu): add export script and initial CSV template"
```

---

### Task 2: Build CSV Validator and Menu Importer

**Files:**
- Create: `scripts/import-food-menu.mjs`
- Test: `tests/import-food-menu.test.mjs`

**Interfaces:**
- Consumes: A CSV file path passed via command line argument (defaulting to `scratch/menu-template.csv`), `FOOD_CATEGORIES` from `lib/constants/food-menu-data.ts`.
- Produces: Updated `lib/constants/food-menu-data.ts` (`FOOD_DISHES` array) when `--write` flag is present, or prints validation report in dry-run mode.

- [ ] **Step 1: Write failing test for CSV parser and validation logic**

```javascript
// tests/import-food-menu.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { parseCsv, validateDishRows } from "../scripts/import-food-menu.mjs";

test("validateDishRows rejects invalid category slugs", () => {
  const invalidRows = [
    {
      id: "test-dish",
      name: "Test Dish",
      category: "invalid-cat",
      price: "500 TK",
      description: "Tasty dish",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/dish.jpg",
    },
  ];
  const { valid, errors } = validateDishRows(invalidRows);
  assert.equal(valid, false);
  assert.match(errors[0], /invalid-cat/);
});

test("validateDishRows accepts compliant dish rows", () => {
  const validRows = [
    {
      id: "garlic-mushrooms",
      name: "Garlic Mushrooms",
      category: "starters",
      price: "450 TK",
      description: "Sauteed button mushrooms",
      portion: "1:2",
      isPopular: "true",
      isSpicy: "false",
      imageUrl: "https://res.cloudinary.com/salt-ember/image/upload/v1/dish.jpg",
    },
  ];
  const { valid, errors } = validateDishRows(validRows);
  assert.equal(valid, true);
  assert.equal(errors.length, 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/import-food-menu.test.mjs`  
Expected: FAIL with missing module `scripts/import-food-menu.mjs`.

- [ ] **Step 3: Implement `scripts/import-food-menu.mjs`**

Implement:
1. `parseCsv(csvString)`: Standard RFC 4180 CSV parser handling quoted fields, commas, and escaped quotes.
2. `validateDishRows(rows)`: Validates unique IDs, presence of `name`/`price`/`description`, valid category from the 14 allowed categories, and valid Cloudinary/HTTPS URLs.
3. `generateTypeScriptCode(dishes)`: Formats dishes cleanly into valid TypeScript for `lib/constants/food-menu-data.ts`.
4. CLI execution handling `--dry-run` (default) vs `--write`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/import-food-menu.test.mjs`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/import-food-menu.mjs tests/import-food-menu.test.mjs
git commit -m "feat(menu): add validation and import script for food dishes"
```

---

### Task 3: Update Existing Tests to Support Cloudinary Dish Delivery

**Files:**
- Modify: `tests/food-categories-tabs.test.mjs:60-66`

**Interfaces:**
- Consumes: `lib/constants/food-menu-data.ts`
- Verifies: Dish images allow both Cloudinary (`res.cloudinary.com`) and legacy fallbacks without failing test assertions.

- [ ] **Step 1: Check existing test failure under Cloudinary URL format**

Review `tests/food-categories-tabs.test.mjs:64`:
`assert.match(dataFile, /image:\s*"https:\/\/lh3\.googleusercontent\.com/)`
Notice that switching to Cloudinary would fail this strict assertion.

- [ ] **Step 2: Update assertion to accept Cloudinary and CDN dish images**

Modify `tests/food-categories-tabs.test.mjs` to assert that dishes use valid image URLs (`https://res.cloudinary.com` or `https://lh3.googleusercontent.com`):

```javascript
test("Food menu dishes have CDN-optimized images configured", async () => {
  const dataFile = await readSource("../lib/constants/food-menu-data.ts");
  
  assert.match(dataFile, /image\?:\s*string;/, "Expected FoodItem to have optional image field");
  assert.match(
    dataFile,
    /image:\s*"https:\/\/(res\.cloudinary\.com|lh3\.googleusercontent\.com)/,
    "Expected Cloudinary or Google CDN dish images",
  );
});
```

- [ ] **Step 3: Run test suite to verify it passes**

Run: `node --test tests/food-categories-tabs.test.mjs`  
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/food-categories-tabs.test.mjs
git commit -m "test(menu): accept Cloudinary URLs in food categories tab test"
```

---

### Task 4: End-to-End Dry Run & Verification

**Files:**
- Run scripts: `scripts/export-menu-template.mjs`, `scripts/import-food-menu.mjs`
- Test: All repository tests (`npm run test`), TypeScript compile (`npm run type-check`)

- [ ] **Step 1: Execute export script to generate `scratch/menu-template.csv`**

Run: `node scripts/export-menu-template.mjs`  
Expected: CSV successfully generated with 136 rows.

- [ ] **Step 2: Execute import script in dry-run mode against the generated CSV**

Run: `node scripts/import-food-menu.mjs scratch/menu-template.csv`  
Expected: "Validation successful: 136 dishes verified. 0 errors."

- [ ] **Step 3: Execute full project test and type-check suites**

Run: `npm run type-check`  
Run: `npm run test`  
Expected: All suites PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add scratch/menu-template.csv
git commit -m "chore(menu): verify export and import pipeline end-to-end"
```
