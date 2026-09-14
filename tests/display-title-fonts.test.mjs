import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("provides switchable DynaPuff and Original Surfer fonts for display titles", async () => {
  const layout = await readSource("../app/layout.tsx");

  assert.match(layout, /DynaPuff/);
  assert.match(layout, /Original_Surfer/);
  assert.match(layout, /--font-dynapuff/);
  assert.match(layout, /--font-original-surfer/);
  assert.match(layout, /data-title-font="dynapuff"/);
});

test("scopes the display-font trial to the hero and section titles", async () => {
  const [hero, menu, testimonials, styles] = await Promise.all([
    readSource("../components/hero-section.tsx"),
    readSource("../components/menu.tsx"),
    readSource("../components/testimonials.tsx"),
    readSource("../app/globals.css"),
  ]);

  assert.match(hero, /<h1 className="font-heading display-title">/);
  assert.match(menu, /className="bracket-title font-heading display-title text-balance"/);
  assert.match(
    testimonials,
    /className="bracket-title font-heading display-title text-balance"/,
  );
  assert.match(styles, /\.display-title/);
  assert.match(styles, /data-title-font="original-surfer"/);
});
