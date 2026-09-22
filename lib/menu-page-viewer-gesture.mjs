export function getMenuPageSwipeDirection({
  endX,
  endY,
  hasMultipleTouches,
  startedAt,
  startX,
  startY,
}) {
  if (hasMultipleTouches || Date.now() - startedAt > 800) {
    return null;
  }

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (Math.abs(deltaX) < 56 || Math.abs(deltaX) <= Math.abs(deltaY)) {
    return null;
  }

  return deltaX < 0 ? "next" : "previous";
}
