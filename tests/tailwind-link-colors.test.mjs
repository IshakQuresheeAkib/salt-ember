import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheetPath = new URL("../app/globals.css", import.meta.url);

test("keeps the global anchor reset in the base layer so Tailwind link colors can override it", async () => {
  const stylesheet = await readFile(stylesheetPath, "utf8");

  assert.match(
    stylesheet,
    /@layer base\s*\{\s*a\s*\{\s*color:\s*inherit;\s*text-decoration:\s*none;\s*\}\s*\}/,
  );
});
