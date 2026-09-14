import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const carouselPath = new URL("../components/ui/card-fan-carousel.tsx", import.meta.url);
const stylesheetPath = new URL("../app/globals.css", import.meta.url);

test("menu carousel arrows use outward attention cues that honour reduced motion", () => {
  const carousel = readFileSync(carouselPath, "utf8");
  const stylesheet = readFileSync(stylesheetPath, "utf8");

  assert.match(carousel, /<ChevronLeft[\s\S]*className="fan-carousel__arrow fan-carousel__arrow--previous/);
  assert.match(carousel, /<ChevronRight[\s\S]*className="fan-carousel__arrow fan-carousel__arrow--next/);
  assert.match(stylesheet, /\.fan-carousel__arrow\s*\{[\s\S]*animation: fan-carousel-arrow-nudge/);
  assert.match(stylesheet, /\.fan-carousel__arrow--previous\s*\{[\s\S]*--fan-carousel-arrow-offset: -3px/);
  assert.match(stylesheet, /\.fan-carousel__arrow--next\s*\{[\s\S]*--fan-carousel-arrow-offset: 3px/);
  assert.match(stylesheet, /@keyframes fan-carousel-arrow-nudge/);
  assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration: 0\.01ms !important/);
});
