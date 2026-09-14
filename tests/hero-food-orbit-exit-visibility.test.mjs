import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the outgoing hero plate fades only at the end of its path", async () => {
  const source = await readFile(
    new URL("../components/hero-food-selector.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /const DISH_FADE_SECONDS = 0\.6;/);
  assert.match(
    source,
    /const OUTGOING_FADE_START_SECONDS =\s*DISH_MOTION_SECONDS - DISH_FADE_SECONDS;/,
  );
  assert.match(source, /outgoingMotion: SceneMotionState \| null;/);
  assert.match(
    source,
    /outgoingMotion: captureSceneMotion\(current\.activeIndex\),/,
  );
  assert.match(source, /const outgoingMotion = transition\.outgoingMotion;/);
  assert.doesNotMatch(
    source,
    /const outgoingMotion = outgoingFood\s*\? sceneMotionRef\.current\.get/,
  );
  assert.match(
    source,
    /\.to\(\s*outgoingScene,\s*\{\s*autoAlpha: 0,\s*duration: DISH_FADE_SECONDS,\s*ease: "ember-out"\s*\},\s*OUTGOING_FADE_START_SECONDS,\s*\)/s,
  );
});
