import assert from "node:assert/strict";
import test from "node:test";

let carouselLayout = null;

try {
  carouselLayout = await import("../lib/card-fan-carousel-layout.mts");
} catch {
  // The first TDD run intentionally exercises the not-yet-implemented contract.
}

test("a long carousel wraps seven visible cards around the selected page", () => {
  assert.deepEqual(carouselLayout?.getVisibleFanSlots(10, 0), [
    { cardIndex: 7, slot: 0 },
    { cardIndex: 8, slot: 1 },
    { cardIndex: 9, slot: 2 },
    { cardIndex: 0, slot: 3 },
    { cardIndex: 1, slot: 4 },
    { cardIndex: 2, slot: 5 },
    { cardIndex: 3, slot: 6 },
  ]);
});

test("the initial selection honours an explicit page and otherwise uses the fan centre", () => {
  assert.equal(carouselLayout?.getInitialFanCenter?.(28), 3);
  assert.equal(carouselLayout?.getInitialFanCenter?.(5), 2);
  assert.equal(carouselLayout?.getInitialFanCenter?.(28, 12), 12);
  assert.equal(carouselLayout?.getInitialFanCenter?.(5, 99), 4);
  assert.equal(carouselLayout?.getInitialFanCenter?.(0, 3), 0);
});

test("a short carousel keeps every card and centres its fan geometry", () => {
  assert.deepEqual(carouselLayout?.getVisibleFanSlots(5, 2), [
    { cardIndex: 0, slot: 0 },
    { cardIndex: 1, slot: 1 },
    { cardIndex: 2, slot: 2 },
    { cardIndex: 3, slot: 3 },
    { cardIndex: 4, slot: 4 },
  ]);

  const firstPosition = carouselLayout?.getFanSlotPosition(5, 0);
  assert.equal(firstPosition?.rotation, -21);
  assert.ok(Math.abs(firstPosition?.scale - 0.7756) < Number.EPSILON);
  assert.equal(firstPosition?.xRem, -30);
  assert.equal(firstPosition?.yRem, 7.3);
  assert.equal(firstPosition?.zIndex, 8);
  assert.deepEqual(carouselLayout?.getFanSlotPosition(5, 2), {
    rotation: 0,
    scale: 1,
    xRem: 0,
    yRem: 0,
    zIndex: 10,
  });
});

test("mobile fan spacing compresses horizontally while retaining the card angles", () => {
  assert.deepEqual(carouselLayout?.getResponsiveFanPosition(7, 0, 390, 844), {
    rotation: -21,
    scale: 0.7756,
    xRem: -8.4,
    yRem: 7.3,
    zIndex: 1,
  });
});

test("a short viewport compresses vertical offsets to its seventy-percent budget", () => {
  const position = carouselLayout?.getResponsiveFanPosition(7, 0, 1280, 400);

  assert.equal(position?.xRem, -30);
  assert.equal(position?.rotation, -21);
  assert.ok(Math.abs(position?.yRem - 3.361842105263158) < 1e-12);
  assert.ok(
    Math.abs(
      carouselLayout?.getFanEntryOffsetRem?.(1280, 400) - 5.526315789473684,
    ) < 1e-12,
  );
});

test("hover lifts the selected card and pushes its neighbours away", () => {
  const positions = carouselLayout?.getHoveredFanPositions(7, 3, 1280, 900);

  assert.equal(positions?.[3].yRem, -2.5);
  assert.equal(positions?.[3].scale, 1.08);
  assert.ok(positions?.[2].xRem < -11);
  assert.ok(positions?.[4].xRem > 11);
});
