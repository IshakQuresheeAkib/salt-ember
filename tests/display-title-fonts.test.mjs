import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("loads Yeon Sung as the shared title font", async () => {
  const layout = await readSource("../app/layout.tsx");

  assert.match(layout, /Yeon_Sung/);
  assert.match(layout, /weight: "400"/);
  assert.match(layout, /variable: "--font-title"/);
  assert.match(layout, /\$\{titleFont\.variable\}/);
  assert.doesNotMatch(layout, /data-title-font/);
});

test("applies the shared title font to the hero and section headings", async () => {
  const [hero, menu, testimonials, tailwind] = await Promise.all([
    readSource("../components/hero-section.tsx"),
    readSource("../components/menu.tsx"),
    readSource("../components/testimonials.tsx"),
    readSource("../lib/tailwind.ts"),
  ]);

  assert.match(hero, /font-\[family-name:var\(--font-title\)\]/);
  assert.match(tailwind, /font-\[family-name:var\(--font-title\)\]/);
  assert.match(menu, /className=\{sectionHeadingClassName\}/);
  assert.match(testimonials, /className=\{sectionHeadingClassName\}/);
});
