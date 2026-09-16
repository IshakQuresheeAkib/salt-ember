import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const carouselPath = new URL(
  "../components/ui/card-carousel.tsx",
  import.meta.url,
);
const stylesheetPath = new URL("../app/globals.css", import.meta.url);

test("menu carousel arrows use outward attention cues that honour reduced motion", () => {
  const carousel = readFileSync(carouselPath, "utf8");
  const stylesheet = readFileSync(stylesheetPath, "utf8");

  assert.match(
    carousel,
    /<ChevronLeft[\s\S]*className="carousel__arrow carousel__arrow--previous/,
  );
  assert.match(
    carousel,
    /<ChevronRight[\s\S]*className="carousel__arrow carousel__arrow--next/,
  );
  assert.match(
    stylesheet,
    /\.carousel__arrow\s*\{[\s\S]*animation: carousel-arrow-nudge/,
  );
  assert.match(
    stylesheet,
    /\.carousel__arrow--previous\s*\{[\s\S]*--carousel-arrow-offset: -4px/,
  );
  assert.match(
    stylesheet,
    /\.carousel__arrow--next\s*\{[\s\S]*--carousel-arrow-offset: 4px/,
  );
  assert.match(stylesheet, /@keyframes carousel-arrow-nudge/);
  assert.match(
    stylesheet,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration: 0\.01ms !important/,
  );
});

test("menu carousel mounts only its active and exiting card windows", () => {
  const carousel = readFileSync(carouselPath, "utf8");

  assert.match(
    carousel,
    /const \[exitingCardIndexes, setExitingCardIndexes\] = useState<Set<number>>\(/,
  );
  assert.match(
    carousel,
    /const mountedCardIndexes = useMemo\([\s\S]*visibleMap\.keys\(\)[\s\S]*exitingCardIndexes/,
  );
  assert.match(
    carousel,
    /setExitingCardIndexes\(new Set\(visibleMap\.keys\(\)\)\);/,
  );
  assert.match(
    carousel,
    /setExitingCardIndexes\(new Set\(\)\);/,
  );
  assert.match(
    carousel,
    /\{cards\.map\(\(card, index\) =>[\s\S]*mountedCardIndexes\.has\(index\)/,
  );
  assert.match(
    carousel,
    /const cardIndex = Number\(element\.dataset\.menuCard\);/,
  );
});

test("menu carousel disables and announces pagination while card motion is locked", () => {
  const carousel = readFileSync(carouselPath, "utf8");

  assert.match(
    carousel,
    /const \[isCarouselLocked, setIsCarouselLocked\] = useState\(/,
  );
  assert.match(carousel, /if \(isFirstMount && !shouldReduceMotion\)[\s\S]*setIsCarouselLocked\(true\)/);
  assert.match(carousel, /const finishCardAnimation = \(\) => \{[\s\S]*setIsCarouselLocked\(false\)/);
  assert.match(carousel, /if \(shouldReduceMotion\) \{[\s\S]*setIsCarouselLocked\(false\)/);
  assert.match(carousel, /disabled=\{isCarouselLocked\}/);
  assert.match(
    carousel,
    /aria-live="polite"[\s\S]*isCarouselLocked[\s\S]*controls are temporarily unavailable/,
  );
});
