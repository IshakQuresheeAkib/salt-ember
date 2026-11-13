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

test("Food menu dishes have mobile-optimized images configured", async () => {
  const dataFile = await readSource("../lib/constants/food-menu-data.ts");
  
  assert.match(dataFile, /image\?:\s*string;/, "Expected FoodItem to have optional image field");
  assert.match(dataFile, /image:\s*"https:\/\/lh3\.googleusercontent\.com/, "Expected Google Photos CDN dish images");
  assert.match(dataFile, /=w400-h267-c-rw/, "Expected mobile-optimized 400px WebP crop parameter");
});

test("FoodMenuSection uses Next.js Image with responsive mobile sizes", async () => {
  const sectionSource = await readSource("../components/food-menu-section.tsx");
  
  assert.match(sectionSource, /import Image from "next\/image"/, "Expected Next.js Image import");
  assert.match(sectionSource, /sizes="\(max-width: 640px\) 250px, \(max-width: 1024px\) 350px, 400px"/, "Expected responsive mobile sizes attribute");
  assert.match(sectionSource, /unoptimized=\{dish\.image\.includes\("googleusercontent\.com"\)\}/, "Expected unoptimized flag for pre-rendered Google CDN WebP thumbnails");
});

test("next.config.ts configures Google Photos remotePattern", async () => {
  const configSource = await readSource("../next.config.ts");
  
  assert.match(configSource, /hostname:\s*"lh3\.googleusercontent\.com"/, "Expected lh3.googleusercontent.com in remotePatterns");
});
