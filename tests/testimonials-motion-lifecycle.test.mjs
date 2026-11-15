import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const testimonialsPath = new URL(
  "../components/testimonials.tsx",
  import.meta.url,
);

test("testimonial motion lifecycle uses Framer Motion frame loop and respects pause", () => {
  const testimonials = readFileSync(testimonialsPath, "utf8");

  assert.match(testimonials, /useAnimationFrame/);
  assert.match(testimonials, /if\s*\(isPaused\)\s*\{\s*return;\s*\}/);
});

test("testimonial motion respects reduced motion preference", () => {
  const testimonials = readFileSync(testimonialsPath, "utf8");

  assert.match(testimonials, /useReducedMotion\(\)/);
  assert.match(testimonials, /motionIsPaused = shouldReduceMotion === true/);
  assert.match(testimonials, /testimonialStaticGridClassName/);
});
