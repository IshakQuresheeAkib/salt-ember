export const MAX_VISIBLE_FAN_CARDS = 5;

const MOBILE_BREAKPOINT = 480;
const LAPTOP_BREAKPOINT = 800;
const DESKTOP_BREAKPOINT = 1440;
const CAROUSEL_MAX_WIDTH_PX = 1280;
const CAROUSEL_EDGE_GUTTER_PX = 16;
const CARD_ASPECT_RATIO = 1024 / 811;

export interface FanPosition {
  rotation: number;
  scale: number;
  xRem: number;
  yRem: number;
  zIndex: number;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getVisibleFanCardCount(viewportWidth: number) {
  return viewportWidth < LAPTOP_BREAKPOINT ? 3 : MAX_VISIBLE_FAN_CARDS;
}

export function getInitialFanViewportWidth() {
  return 0;
}

function getCardWidthPx(viewportWidth: number) {
  if (viewportWidth < MOBILE_BREAKPOINT) {
    return clamp(viewportWidth * 0.6, 180, 260);
  }
  if (viewportWidth < LAPTOP_BREAKPOINT) {
    return clamp(viewportWidth * 0.42, 220, 340);
  }
  if (viewportWidth < DESKTOP_BREAKPOINT) {
    return clamp(viewportWidth * 0.27, 280, 400);
  }
  return clamp(viewportWidth * 0.19, 360, 480);
}

function getCarouselHeightPx(viewportWidth: number) {
  if (viewportWidth < MOBILE_BREAKPOINT) return 544;
  if (viewportWidth < LAPTOP_BREAKPOINT) return 608;
  if (viewportWidth < DESKTOP_BREAKPOINT) return 704;
  return 832;
}

function constrainPositionToStage(
  position: FanPosition,
  viewportWidth: number,
  stageWidthPx = Math.min(viewportWidth, CAROUSEL_MAX_WIDTH_PX),
) {
  const cardWidth = getCardWidthPx(viewportWidth) * position.scale;
  const cardHeight = cardWidth * CARD_ASPECT_RATIO;
  const rotation = (Math.abs(position.rotation) * Math.PI) / 180;
  const rotatedWidth =
    cardWidth * Math.cos(rotation) + cardHeight * Math.sin(rotation);
  const rotatedHeight =
    cardHeight * Math.cos(rotation) + cardWidth * Math.sin(rotation);
  const maxX = Math.max(
    0,
    Math.min(stageWidthPx, CAROUSEL_MAX_WIDTH_PX) / 2 -
      rotatedWidth / 2 -
      CAROUSEL_EDGE_GUTTER_PX,
  );
  const maxY = Math.max(
    0,
    getCarouselHeightPx(viewportWidth) / 2 -
      rotatedHeight / 2 -
      CAROUSEL_EDGE_GUTTER_PX,
  );

  return {
    ...position,
    xRem: clamp(position.xRem * 16, -maxX, maxX) / 16,
    yRem: clamp(position.yRem * 16, -maxY, maxY) / 16,
  };
}

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

export function getInitialFanCenter(totalCards: number, initialIndex?: number) {
  if (totalCards <= 0) return 0;

  const fallback =
    totalCards > MAX_VISIBLE_FAN_CARDS ? MAX_VISIBLE_FAN_CARDS >> 1 : totalCards >> 1;

  return Math.min(Math.max(initialIndex ?? fallback, 0), totalCards - 1);
}

export function getFanEntryOffsetRem(
  viewportWidth: number,
  viewportHeight: number,
) {
  return 12 * getVerticalMultiplier(viewportWidth, viewportHeight);
}

export function getVisibleFanSlots(
  totalCards: number,
  centerIndex: number,
  requestedCount = MAX_VISIBLE_FAN_CARDS,
) {
  if (totalCards <= 0) return [];

  const visibleCardCount = clamp(
    requestedCount % 2 === 0 ? requestedCount - 1 : requestedCount,
    1,
    MAX_VISIBLE_FAN_CARDS,
  );

  if (totalCards <= visibleCardCount) {
    return Array.from({ length: totalCards }, (_, cardIndex) => ({
      cardIndex,
      slot: cardIndex,
    }));
  }

  const normalizedCenter = ((centerIndex % totalCards) + totalCards) % totalCards;

  const fanHalf = visibleCardCount >> 1;

  return Array.from({ length: visibleCardCount }, (_, slot) => ({
    cardIndex:
      (normalizedCenter + slot - fanHalf + totalCards) % totalCards,
    slot,
  }));
}

export function getFanSlotPosition(slotCount: number, slot: number): FanPosition {
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
  stageWidthPx?: number,
): FanPosition {
  const base = getFanSlotPosition(slotCount, slot);

  return constrainPositionToStage(
    {
      ...base,
      xRem: base.xRem * getHorizontalMultiplier(viewportWidth),
      yRem: base.yRem * getVerticalMultiplier(viewportWidth, viewportHeight),
    },
    viewportWidth,
    stageWidthPx,
  );
}

export function getHoveredFanPositions(
  slotCount: number,
  hoveredSlot: number | null,
  viewportWidth: number,
  viewportHeight: number,
  stageWidthPx?: number,
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

    if (hoveredSlot === null) {
      return constrainPositionToStage(position, viewportWidth, stageWidthPx);
    }

    const slotDistance = Math.abs(slot - hoveredSlot);

    if (slot === hoveredSlot) {
      return constrainPositionToStage(
        {
          ...position,
          scale: position.scale * 1.08,
          yRem: position.yRem - 2.5 * verticalMultiplier,
        },
        viewportWidth,
        stageWidthPx,
      );
    }

    const normalizedDistance =
      centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
    const pushStrength =
      8 *
      (1 - Math.abs(normalizedDistance)) *
      (1 + 0.2 * Math.max(0, centerSlot - slotDistance));
    const direction = slot < hoveredSlot ? -1 : 1;

    return constrainPositionToStage(
      {
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
      },
      viewportWidth,
      stageWidthPx,
    );
  });
}
