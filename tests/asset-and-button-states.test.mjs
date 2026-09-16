import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const footerPath = new URL("../components/footer.tsx", import.meta.url);
const buttonPath = new URL("../components/ui/button.tsx", import.meta.url);

test("the below-fold footer logo is not preloaded", () => {
  const footer = readFileSync(footerPath, "utf8");

  assert.doesNotMatch(footer, /<Image[\s\S]*?priority/);
});

test("text buttons have a distinct hover color", () => {
  const button = readFileSync(buttonPath, "utf8");

  assert.match(
    button,
    /text: "[^"\n]*text-orange[^"\n]*hover:text-silver[^"\n]*hover:decoration-silver/,
  );
});
