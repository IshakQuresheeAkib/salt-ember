import assert from "node:assert/strict";
import test from "node:test";
import { canScheduleHeroRotation } from "../lib/hero-food-autoplay-state.mts";

test("hero rotation schedules while the document is visible and motion is allowed", () => {
  assert.equal(
    canScheduleHeroRotation({
      isDocumentVisible: true,
      reducedMotion: false,
    }),
    true,
  );

  for (const override of [
    { isDocumentVisible: false },
    { reducedMotion: true },
  ]) {
    assert.equal(
      canScheduleHeroRotation({
        isDocumentVisible: true,
        reducedMotion: false,
        ...override,
      }),
      false,
    );
  }
});
