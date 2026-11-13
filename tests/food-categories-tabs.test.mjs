import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("FOOD_CATEGORIES includes all categories from the Salt & Ember menu PDF", async () => {
  const dataFile = await readSource("../lib/constants/food-menu-data.ts");

  const expectedCategories = [
    "Appetizers & Starters",
    "Soups & Noodles",
    "Salads",
    "Beef Steaks",
    "Slow-Cooked Meat",
    "Main Courses",
    "Pasta & Spaghetti",
    "Pizza",
    "Thai & Chinese",
    "Kebabs & Naan",
    "Biryani",
    "Side Dishes",
    "Beverages",
    "Desserts & Pastry",
  ];

  for (const cat of expectedCategories) {
    assert.match(
      dataFile,
      new RegExp(cat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `Expected category '${cat}' to be present in menu data`,
    );
  }

  assert.doesNotMatch(
    dataFile,
    /name:\s*["']All Dishes["']/,
    "Expected 'All Dishes' tab option to be removed",
  );
});

test("CategoryTabs implements accessible tablist and matching underline indicator layout", async () => {
  const tabsSource = await readSource("../components/ui/category-tabs.tsx");

  assert.match(tabsSource, /role="tablist"/);
  assert.match(tabsSource, /role="tab"/);
  assert.match(tabsSource, /aria-selected=\{isActive\}/);
  assert.match(tabsSource, /border-b/);
  assert.match(tabsSource, /active-category-underline/);
  assert.match(tabsSource, /bg-orange/);
});

test("FoodMenuSection is mounted in the main page", async () => {
  const pageSource = await readSource("../app/page.tsx");

  assert.match(pageSource, /FoodMenuSection/);
  assert.match(pageSource, /import \{ FoodMenuSection \} from "@\/components\/food-menu-section"/);
});
