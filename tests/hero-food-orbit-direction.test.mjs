import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("every hero food selection uses the forward seam direction", async () => {
  const source = await readFile(
    new URL("../components/hero-food-selector.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /getShortestDirection/);
  assert.doesNotMatch(source, /automaticDirection/);
  assert.match(source, /direction:\s*1,/);
  assert.match(source, /selectFood\(null\);/);
  assert.match(source, /const AUTOPLAY_DWELL_MS = 500;/);
});
