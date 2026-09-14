import assert from "node:assert/strict";
import test from "node:test";
import {
  canScheduleHeroRotation,
  reduceHeroRotationPause,
} from "../lib/hero-food-autoplay-state.mts";

test("hero rotation pauses only after keyboard-visible focus and resumes on toggle", () => {
  const pointerFocusPause = reduceHeroRotationPause(false, {
    type: "focus",
    focusVisible: false,
  });
  const keyboardFocusPause = reduceHeroRotationPause(false, {
    type: "focus",
    focusVisible: true,
  });

  assert.equal(pointerFocusPause, false);
  assert.equal(keyboardFocusPause, true);
  assert.equal(
    reduceHeroRotationPause(keyboardFocusPause, { type: "toggle" }),
    false,
  );
});

test("hero rotation schedules only while unpaused, unhovered, visible, and motion-safe", () => {
  assert.equal(
    canScheduleHeroRotation({
      isRotationPaused: false,
      isPointerHovered: false,
      isDocumentVisible: true,
      reducedMotion: false,
    }),
    true,
  );

  for (const override of [
    { isRotationPaused: true },
    { isPointerHovered: true },
    { isDocumentVisible: false },
    { reducedMotion: true },
  ]) {
    assert.equal(
      canScheduleHeroRotation({
        isRotationPaused: false,
        isPointerHovered: false,
        isDocumentVisible: true,
        reducedMotion: false,
        ...override,
      }),
      false,
    );
  }
});
