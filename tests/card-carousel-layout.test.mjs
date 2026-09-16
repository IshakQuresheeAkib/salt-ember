import assert from "node:assert/strict";
import test from "node:test";

let carouselLayout = null;

try {
  carouselLayout = await import("../lib/card-carousel-layout.mts");
} catch {
  // The first TDD run intentionally exercises the not-yet-implemented contract.
}

test("a long carousel wraps the configured visible cards around the selected page", () => {
  assert.deepEqual(carouselLayout?.getVisibleSlots(10, 0, 5), [
    { cardIndex: 8, slot: 0 },
    { cardIndex: 9, slot: 1 },
    { cardIndex: 0, slot: 2 },
    { cardIndex: 1, slot: 3 },
    { cardIndex: 2, slot: 4 },
  ]);
});

test("the responsive card count uses three cards on narrow screens and five from laptop up", () => {
  assert.equal(carouselLayout?.getVisibleCardCount?.(479), 3);
  assert.equal(carouselLayout?.getVisibleCardCount?.(480), 3);
  assert.equal(carouselLayout?.getVisibleCardCount?.(799), 3);
  assert.equal(carouselLayout?.getVisibleCardCount?.(800), 5);
  assert.equal(carouselLayout?.getVisibleCardCount?.(2560), 5);
});

test("the carousel uses a server-safe viewport width before hydration", () => {
  assert.equal(carouselLayout?.getInitialViewportWidth?.(), 0);
});

test("the initial selection honours an explicit page and otherwise uses the card centre", () => {
  assert.equal(carouselLayout?.getInitialCenter?.(28), 2);
  assert.equal(carouselLayout?.getInitialCenter?.(5), 2);
  assert.equal(carouselLayout?.getInitialCenter?.(28, 12), 12);
  assert.equal(carouselLayout?.getInitialCenter?.(5, 99), 4);
  assert.equal(carouselLayout?.getInitialCenter?.(0, 3), 0);
});

test("a short carousel keeps every card and centres its card geometry", () => {
  assert.deepEqual(carouselLayout?.getVisibleSlots(5, 2), [
    { cardIndex: 0, slot: 0 },
    { cardIndex: 1, slot: 1 },
    { cardIndex: 2, slot: 2 },
    { cardIndex: 3, slot: 3 },
    { cardIndex: 4, slot: 4 },
  ]);

  const firstPosition = carouselLayout?.getSlotPosition(5, 0);
  assert.equal(firstPosition?.rotation, -21);
  assert.ok(Math.abs(firstPosition?.scale - 0.7756) < Number.EPSILON);
  assert.equal(firstPosition?.xRem, -30);
  assert.equal(firstPosition?.yRem, 7.3);
  assert.equal(firstPosition?.zIndex, 8);
  assert.deepEqual(carouselLayout?.getSlotPosition(5, 2), {
    rotation: 0,
    scale: 1,
    xRem: 0,
    yRem: 0,
    zIndex: 10,
  });
});

test("mobile card spacing compresses horizontally while retaining the card angles", () => {
  const position = carouselLayout?.getResponsivePosition(3, 0, 390, 844);

  assert.equal(position?.rotation, -21);
  assert.ok(Math.abs((position?.scale ?? 0) - 0.7756) < Number.EPSILON);
  assert.ok(Math.abs(position?.xRem ?? Infinity) < 6);
  assert.ok((position?.yRem ?? 0) > 0);
  assert.ok((position?.yRem ?? Infinity) <= 7.3);
  assert.equal(position?.zIndex, 9);
});

test("a guttered mobile stage keeps rotated cards inside its measured width", () => {
  const position = carouselLayout?.getResponsivePosition(3, 0, 390, 844, 340);

  assert.ok(Math.abs(position?.xRem ?? Infinity) < 2);
});

test("mobile outer cards fit the rendered 400-pixel stage height", () => {
  const position = carouselLayout?.getResponsivePosition(3, 0, 390, 844, 340);
  const cardWidth = 390 * 0.6;
  const cardHeight = (cardWidth * 1024) / 811;
  const rotation = (21 * Math.PI) / 180;
  const scale = 0.7756;
  const rotatedHeight =
    cardHeight * scale * Math.cos(rotation) +
    cardWidth * scale * Math.sin(rotation);

  assert.ok(
    (position?.yRem ?? Infinity) * 16 + rotatedHeight / 2 <= 400 / 2 - 16,
  );
});

test("larger laptop cards stay within the carousel stage after their card rotation", () => {
  const position = carouselLayout?.getResponsivePosition(5, 0, 800, 900);
  const cardWidth = 280;
  const cardHeight = (cardWidth * 1024) / 811;
  const rotation = (Math.abs(position?.rotation ?? 0) * Math.PI) / 180;
  const rotatedWidth =
    cardWidth * (position?.scale ?? 0) * Math.cos(rotation) +
    cardHeight * (position?.scale ?? 0) * Math.sin(rotation);

  assert.ok(
    Math.abs(position?.xRem ?? Infinity) * 16 + rotatedWidth / 2 <= 384,
  );
});

test("a short viewport compresses vertical offsets to its seventy-percent budget", () => {
  const position = carouselLayout?.getResponsivePosition(7, 0, 1280, 400);

  assert.ok((position?.xRem ?? -Infinity) > -30);
  assert.equal(position?.rotation, -21);
  assert.ok(Math.abs(position?.yRem - 3.361842105263158) < 1e-12);
  assert.ok(
    Math.abs(
      carouselLayout?.getEntryOffsetRem?.(1280, 400) - 5.526315789473684,
    ) < 1e-12,
  );
});

test("hover lifts the selected card and pushes its neighbours away", () => {
  const positions = carouselLayout?.getHoveredPositions(7, 3, 1280, 900);

  assert.equal(positions?.[3].yRem, -2.5);
  assert.equal(positions?.[3].scale, 1.08);
  assert.ok(positions?.[2].xRem < -11);
  assert.ok(positions?.[4].xRem > 11);
});
