export type HeroRotationPauseEvent =
  | { type: "focus"; focusVisible: boolean }
  | { type: "toggle" };

interface HeroRotationScheduleState {
  isRotationPaused: boolean;
  isPointerHovered: boolean;
  isDocumentVisible: boolean;
  reducedMotion: boolean;
}

export function reduceHeroRotationPause(
  isRotationPaused: boolean,
  event: HeroRotationPauseEvent,
) {
  if (event.type === "toggle") return !isRotationPaused;

  return event.focusVisible ? true : isRotationPaused;
}

export function canScheduleHeroRotation({
  isRotationPaused,
  isPointerHovered,
  isDocumentVisible,
  reducedMotion,
}: HeroRotationScheduleState) {
  return (
    !isRotationPaused &&
    !isPointerHovered &&
    isDocumentVisible &&
    !reducedMotion
  );
}
