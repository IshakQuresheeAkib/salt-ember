import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the footer address break in an inline formatting context", async () => {
  const footer = await readFile(
    new URL("../components/footer.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    footer,
    /className="inline-block min-h-8[^"]*"[\s\S]*?Baruthkhana Point, East Zindabazar[\s\S]*?<br \/>[\s\S]*?Sylhet, Bangladesh/,
  );
});
