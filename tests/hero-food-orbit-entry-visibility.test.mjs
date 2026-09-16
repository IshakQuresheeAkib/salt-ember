import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the incoming hero plate finishes fading in at the orbit centre", async () => {
  const source = await readFile(
    new URL("../components/hero-food-selector.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /const DISH_MOTION_SECONDS = 0\.8;/);
  assert.match(
    source,
    /const activeOpacity =\s*isResumingTransition && activeMotion \? activeMotion\.opacity : 0;/,
  );
  assert.match(
    source,
    /\.to\(\s*activeScene,\s*\{\s*autoAlpha: 1,\s*duration: DISH_MOTION_SECONDS,\s*ease: "ember-out"\s*\},\s*0,\s*\)\s*\.to\(\s*outgoingScene,/s,
  );
});
