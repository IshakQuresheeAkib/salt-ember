import assert from "node:assert/strict";
import test from "node:test";

import { getMenuPageSwipeDirection } from "../lib/menu-page-viewer-gesture.mjs";

const recentGesture = { startedAt: Date.now() };

test("a horizontal swipe moves to the adjacent page", () => {
  assert.equal(
    getMenuPageSwipeDirection({
      ...recentGesture,
      endX: 80,
      endY: 240,
      hasMultipleTouches: false,
      startX: 180,
      startY: 240,
    }),
    "next",
  );
  assert.equal(
    getMenuPageSwipeDirection({
      ...recentGesture,
      endX: 180,
      endY: 240,
      hasMultipleTouches: false,
      startX: 80,
      startY: 240,
    }),
    "previous",
  );
});

test("multi-touch and incidental drags do not change menu pages", () => {
  const baseGesture = {
    ...recentGesture,
    endX: 80,
    endY: 240,
    startX: 180,
    startY: 240,
  };

  assert.equal(
    getMenuPageSwipeDirection({ ...baseGesture, hasMultipleTouches: true }),
    null,
  );
  assert.equal(
    getMenuPageSwipeDirection({
      ...baseGesture,
      endX: 140,
      hasMultipleTouches: false,
      scale: 1,
    }),
    null,
  );
  assert.equal(
    getMenuPageSwipeDirection({
      ...baseGesture,
      endX: 160,
      endY: 140,
      hasMultipleTouches: false,
      scale: 1,
    }),
    null,
  );
});
