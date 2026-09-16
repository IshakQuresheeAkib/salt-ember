import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the incoming hero plate fades with its bottom-to-centre orbit", async () => {
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
    /if \(!outgoingScene\) \{\s*gsap\.set\(activeScene, \{\s*autoAlpha: 1,\s*zIndex: 1,\s*motionPath: motionPathAt\(ARC_MIDPOINT\),/s,
  );
  assert.match(
    source,
    /gsap\.set\(activeScene, \{\s*autoAlpha: activeOpacity,\s*zIndex: 2,\s*motionPath: motionPathAt\(activeStart\),/s,
  );
  assert.match(
    source,
    /\.to\(\s*activeScene,\s*\{\s*autoAlpha: 1,\s*duration: DISH_MOTION_SECONDS,\s*ease: "ember-in-out",\s*\},\s*0,\s*\)\s*\.to\(\s*outgoingScene,/s,
  );
});
