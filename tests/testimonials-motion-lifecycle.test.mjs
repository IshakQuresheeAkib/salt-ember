import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const testimonialsPath = new URL(
  "../components/testimonials.tsx",
  import.meta.url,
);

test("testimonial motion is cancelled while the section is paused", () => {
  const testimonials = readFileSync(testimonialsPath, "utf8");

  assert.doesNotMatch(testimonials, /useAnimationFrame/);
  assert.match(testimonials, /window\.requestAnimationFrame\(updatePosition\)/);
  assert.match(testimonials, /window\.cancelAnimationFrame\(frameId\)/);
});

test("testimonial motion pauses offscreen and during pointer or keyboard interaction", () => {
  const testimonials = readFileSync(testimonialsPath, "utf8");

  assert.match(testimonials, /useInView\(sectionRef, \{ amount: 0\.1 \}\)/);
  assert.match(
    testimonials,
    /shouldReduceMotion === true \|\| !isInView \|\| isInteractionPaused \|\| isUserPaused/,
  );
  assert.match(testimonials, /onPointerEnter=\{\(\) => setIsInteractionPaused\(true\)\}/);
  assert.match(testimonials, /onFocus=\{\(\) => setIsInteractionPaused\(true\)\}/);
  assert.match(testimonials, /aria-label=\{isUserPaused \? "Resume testimonial movement" : "Pause testimonial movement"\}/);
});
