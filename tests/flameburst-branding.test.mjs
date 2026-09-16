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

test("defines the current palette in the canonical project reference", async () => {
  const [css, project] = await Promise.all([
    readProjectFile("app/globals.css"),
    readProjectFile("PROJECT.md"),
  ]);
  const sources = [css, project].join("\n").toLowerCase();

  for (const color of ["#e4e4e4", "#e36414", "#0b2228"]) {
    assert.match(
      sources,
      new RegExp(color),
      `Expected ${color} in the brand system`,
    );
  }
});

test("does not direct contributors to deleted legacy project documents", async () => {
  const project = await readProjectFile("PROJECT.md");

  assert.match(
    project,
    /`PROJECT\.md` replaces the prior project, product, design, docs, and plan documents\./,
  );
});

test("keeps keyboard focus visible with Silver Mist", async () => {
  const css = await readProjectFile("app/globals.css");

  assert.match(
    css,
    /:focus-visible\s*\{[\s\S]*?outline:\s*2px solid var\(--silver\);/,
  );
});
