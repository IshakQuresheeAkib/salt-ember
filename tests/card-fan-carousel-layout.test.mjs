import assert from "node:assert/strict";
import test from "node:test";

let carouselLayout = null;

try {
  carouselLayout = await import("../lib/card-fan-carousel-layout.mts");
} catch {
  // The first TDD run intentionally exercises the not-yet-implemented contract.
}

test("a long carousel wraps the configured visible cards around the selected page", () => {
  assert.deepEqual(carouselLayout?.getVisibleFanSlots(10, 0, 5), [
    { cardIndex: 8, slot: 0 },
    { cardIndex: 9, slot: 1 },
    { cardIndex: 0, slot: 2 },
    { cardIndex: 1, slot: 3 },
    { cardIndex: 2, slot: 4 },
  ]);
});

test("the responsive fan count uses three cards on narrow screens and five from laptop up", () => {
  assert.equal(carouselLayout?.getVisibleFanCardCount?.(479), 3);
  assert.equal(carouselLayout?.getVisibleFanCardCount?.(480), 3);
  assert.equal(carouselLayout?.getVisibleFanCardCount?.(799), 3);
  assert.equal(carouselLayout?.getVisibleFanCardCount?.(800), 5);
  assert.equal(carouselLayout?.getVisibleFanCardCount?.(2560), 5);
});

test("the carousel uses a server-safe viewport width before hydration", () => {
  assert.equal(carouselLayout?.getInitialFanViewportWidth?.(), 0);
});

test("the initial selection honours an explicit page and otherwise uses the fan centre", () => {
  assert.equal(carouselLayout?.getInitialFanCenter?.(28), 2);
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
  const position = carouselLayout?.getResponsiveFanPosition(3, 0, 390, 844);

  assert.equal(position?.rotation, -21);
  assert.ok(Math.abs((position?.scale ?? 0) - 0.7756) < Number.EPSILON);
  assert.ok(Math.abs(position?.xRem ?? Infinity) < 6);
  assert.ok((position?.yRem ?? 0) > 0);
  assert.ok((position?.yRem ?? Infinity) <= 7.3);
  assert.equal(position?.zIndex, 9);
});

test("a guttered mobile stage keeps rotated cards inside its measured width", () => {
  const position = carouselLayout?.getResponsiveFanPosition(3, 0, 390, 844, 340);

  assert.ok(Math.abs(position?.xRem ?? Infinity) < 2);
});

test("larger laptop cards stay within the carousel stage after their fan rotation", () => {
  const position = carouselLayout?.getResponsiveFanPosition(5, 0, 800, 900);
  const cardWidth = 280;
  const cardHeight = (cardWidth * 1024) / 811;
  const rotation = (Math.abs(position?.rotation ?? 0) * Math.PI) / 180;
  const rotatedWidth =
    cardWidth * (position?.scale ?? 0) * Math.cos(rotation) +
    cardHeight * (position?.scale ?? 0) * Math.sin(rotation);

  assert.ok(Math.abs(position?.xRem ?? Infinity) * 16 + rotatedWidth / 2 <= 384);
});

test("a short viewport compresses vertical offsets to its seventy-percent budget", () => {
  const position = carouselLayout?.getResponsiveFanPosition(7, 0, 1280, 400);

  assert.ok((position?.xRem ?? -Infinity) > -30);
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
