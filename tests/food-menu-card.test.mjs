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
