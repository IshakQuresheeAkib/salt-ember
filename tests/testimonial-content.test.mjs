import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const testimonialsPath = new URL(
  "../lib/constants/testimonials.ts",
  import.meta.url,
);
const componentPath = new URL("../components/testimonials.tsx", import.meta.url);

test("uses the supplied Google reviews and Facebook recommendations", async () => {
  const [testimonials, component] = await Promise.all([
    readFile(testimonialsPath, "utf8"),
    readFile(componentPath, "utf8"),
  ]);

  for (const reviewer of [
    "Alam Sheikh",
    "Nafisatus Sadia (Taha)",
    "Shawon Ahmed",
    "Sadia maha",
    "Hamzah Rahman",
    "Nazmul Hassan",
    "Syeda Naima Nafis",
    "MD Azhar Nabil",
    "Sony Karmoker Mnr",
  ]) {
    assert.ok(testimonials.includes(`name: "${reviewer}"`));
  }

  assert.equal(
    (testimonials.match(/source: "Google"/g) ?? []).length,
    5,
    "Expected the five supplied Google reviews",
  );
  assert.equal(
    (testimonials.match(/source: "Facebook"/g) ?? []).length,
    4,
    "Expected the four supplied Facebook recommendations",
  );
  assert.match(testimonials, /rating: 4\.5/);
  assert.match(component, /Google review/);
  assert.match(component, /Recommended on Facebook/);
  assert.doesNotMatch(testimonials, /Maya Rahman|Arif Chowdhury/);
});
