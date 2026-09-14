export const MAX_VISIBLE_FAN_CARDS = 7;

const FAN_HALF = 3;

export interface FanPosition {
  rotation: number;
  scale: number;
  xRem: number;
  yRem: number;
  zIndex: number;
}

const FAN_POSITIONS: readonly FanPosition[] = [
  { rotation: -21, scale: 0.7756, xRem: -30, yRem: 7.3, zIndex: 1 },
  { rotation: -14, scale: 0.8498, xRem: -22, yRem: 4, zIndex: 2 },
  { rotation: -7, scale: 0.9346, xRem: -11, yRem: 1.3, zIndex: 3 },
  { rotation: 0, scale: 1, xRem: 0, yRem: 0, zIndex: 10 },
  { rotation: 7, scale: 0.9346, xRem: 11, yRem: 1.3, zIndex: 3 },
  { rotation: 14, scale: 0.8498, xRem: 22, yRem: 4, zIndex: 2 },
  { rotation: 21, scale: 0.7756, xRem: 30, yRem: 7.3, zIndex: 1 },
];

function getHorizontalMultiplier(viewportWidth: number) {
  if (viewportWidth < 480) return 0.28;
  if (viewportWidth < 640) return 0.38;
  if (viewportWidth < 768) return 0.5;
  if (viewportWidth < 1024) return 0.75;
  return 1;
}

function getVerticalMultiplier(viewportWidth: number, viewportHeight: number) {
  let idealHeightRem: number;

  if (viewportWidth < 480) idealHeightRem = 22;
  else if (viewportWidth < 640) idealHeightRem = 26;
  else if (viewportWidth < 768) idealHeightRem = 28;
  else if (viewportWidth < 1024) idealHeightRem = 34;
  else idealHeightRem = 38;

  return Math.min(1, (viewportHeight * 0.7) / (idealHeightRem * 16));
}

export function getVisibleFanSlots(totalCards: number, centerIndex: number) {
  if (totalCards <= 0) return [];

  if (totalCards <= MAX_VISIBLE_FAN_CARDS) {
    return Array.from({ length: totalCards }, (_, cardIndex) => ({
      cardIndex,
      slot: cardIndex,
    }));
  }

  const normalizedCenter = ((centerIndex % totalCards) + totalCards) % totalCards;

  return Array.from({ length: MAX_VISIBLE_FAN_CARDS }, (_, slot) => ({
    cardIndex:
      (normalizedCenter + slot - FAN_HALF + totalCards) % totalCards,
    slot,
  }));
}

export function getFanSlotPosition(slotCount: number, slot: number): FanPosition {
  if (slotCount >= MAX_VISIBLE_FAN_CARDS) {
    return FAN_POSITIONS[slot] ?? FAN_POSITIONS[FAN_HALF];
  }

  const centerSlot = slotCount >> 1;
  const distance = slotCount > 1 ? (slot - centerSlot) / centerSlot : 0;
  const absoluteDistance = Math.abs(distance);

  return {
    rotation: distance * 21,
    scale: 1 - 0.2244 * absoluteDistance * absoluteDistance,
    xRem: distance * 30,
    yRem: absoluteDistance * absoluteDistance * 7.3,
    zIndex: 10 - Math.abs(slot - centerSlot),
  };
}

export function getResponsiveFanPosition(
  slotCount: number,
  slot: number,
  viewportWidth: number,
  viewportHeight: number,
): FanPosition {
  const base = getFanSlotPosition(slotCount, slot);

  return {
    ...base,
    xRem: base.xRem * getHorizontalMultiplier(viewportWidth),
    yRem: base.yRem * getVerticalMultiplier(viewportWidth, viewportHeight),
  };
}

export function getHoveredFanPositions(
  slotCount: number,
  hoveredSlot: number | null,
  viewportWidth: number,
  viewportHeight: number,
) {
  const horizontalMultiplier = getHorizontalMultiplier(viewportWidth);
  const verticalMultiplier = getVerticalMultiplier(viewportWidth, viewportHeight);
  const centerSlot = slotCount >> 1;

  return Array.from({ length: slotCount }, (_, slot) => {
    const base = getFanSlotPosition(slotCount, slot);
    const position: FanPosition = {
      ...base,
      xRem: base.xRem * horizontalMultiplier,
      yRem: base.yRem * verticalMultiplier,
    };

    if (hoveredSlot === null) return position;

    const slotDistance = Math.abs(slot - hoveredSlot);

    if (slot === hoveredSlot) {
      return {
        ...position,
        scale: position.scale * 1.08,
        yRem: position.yRem - 2.5 * verticalMultiplier,
      };
    }

    const normalizedDistance =
      centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
    const pushStrength =
      8 *
      (1 - Math.abs(normalizedDistance)) *
      (1 + 0.2 * Math.max(0, 3 - slotDistance));
    const direction = slot < hoveredSlot ? -1 : 1;

    return {
      ...position,
      rotation:
        position.rotation + direction * (3 / (slotDistance + 1)),
      xRem: position.xRem + direction * pushStrength * horizontalMultiplier,
      yRem:
        position.yRem -
        ((slot === slotCount - 1 && hoveredSlot < centerSlot) ||
        (slot === 0 && hoveredSlot > centerSlot)
          ? verticalMultiplier
          : 0),
    };
  });
}
