import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheetPath = new URL("../app/globals.css", import.meta.url);
const componentPaths = [
  "../components/header.tsx",
  "../components/hero-food-selector.tsx",
  "../components/hero-section.tsx",
  "../components/testimonials.tsx",
];

test("uses named Tailwind breakpoints for the shared responsive thresholds", async () => {
  const stylesheet = await readFile(stylesheetPath, "utf8");
  const componentSources = await Promise.all(
    componentPaths.map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const componentSource = componentSources.join("\n");

  assert.match(stylesheet, /--breakpoint-mobile:\s*480px;/);
  assert.match(stylesheet, /--breakpoint-tablet:\s*801px;/);
  assert.match(stylesheet, /--breakpoint-desktop:\s*801px;/);
  assert.doesNotMatch(componentSource, /(?:min-\[801px\]|max-\[800px\]|max-\[480px\]):/);
  assert.match(componentSource, /(?:desktop|max-tablet|max-mobile):/);
});
