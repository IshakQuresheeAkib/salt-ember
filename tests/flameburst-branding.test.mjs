import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const readProjectFile = (relativePath) =>
  readFile(path.join(projectRoot, relativePath), "utf8");

test("defines the approved Flameburst palette across the brand sources", async () => {
  const [css, design, brandGuide, projectContext] = await Promise.all([
    readProjectFile("app/globals.css"),
    readProjectFile("DESIGN.md"),
    readProjectFile("docs/brand.md"),
    readProjectFile("PROJECT_CONTEXT.md"),
  ]);
  const sources = [css, design, brandGuide, projectContext].join("\n").toLowerCase();

  for (const color of ["#e4e4e4", "#fc5000", "#050505"]) {
    assert.match(sources, new RegExp(color), `Expected ${color} in the brand system`);
  }

  for (const token of ["soft-amber", "golden-hour", "sunset-orange", "burnt-sienna", "deep-amber", "rich-espresso"]) {
    assert.doesNotMatch(sources, new RegExp(`--${token}`), `Expected ${token} to be retired`);
  }
});

test("uses a restrained heat bloom over the hero's vertical brand field", async () => {
  const css = await readProjectFile("app/globals.css");

  assert.match(
    css,
    /\.hero-art::before\s*\{[\s\S]*?radial-gradient\([\s\S]*?var\(--flameburst-orange\) 34%, transparent\)[\s\S]*?linear-gradient\([\s\S]*?color-mix\(in srgb, var\(--silver-mist\) 18%, var\(--midnight-shadow\)\) 0%[\s\S]*?var\(--flameburst-orange\) 28%[\s\S]*?var\(--midnight-shadow\) 100%/,
  );
});

test("keeps keyboard focus visible with Silver Mist", async () => {
  const css = await readProjectFile("app/globals.css");

  assert.match(
    css,
    /:focus-visible\s*\{[\s\S]*?outline:\s*2px solid var\(--silver-mist\);/,
  );
});
