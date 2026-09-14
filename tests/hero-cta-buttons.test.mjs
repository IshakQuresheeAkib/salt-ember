import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("uses reusable button variants for hero CTAs", async () => {
  const heroSource = await readFile(
    new URL("../components/hero-section.tsx", import.meta.url),
    "utf8",
  );
  const buttonSource = await readFile(
    new URL("../components/ui/button.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    heroSource,
    /import \{ Button \} from "@\/components\/ui\/button";/,
  );
  assert.match(heroSource, /variant="primary"\s+href="#menu"/);
  assert.match(heroSource, /variant="secondary"\s+href="#contact"/);
  assert.match(
    buttonSource,
    /export type ButtonVariant = "primary" \| "secondary" \| "text";/,
  );
  assert.match(
    buttonSource,
    /function isButtonLink[\s\S]*?typeof props\.href === "string";/,
  );
});
