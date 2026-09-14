interface HeroRotationScheduleState {
  isDocumentVisible: boolean;
  reducedMotion: boolean;
}

export function canScheduleHeroRotation({
  isDocumentVisible,
  reducedMotion,
}: HeroRotationScheduleState) {
  return isDocumentVisible && !reducedMotion;
}
