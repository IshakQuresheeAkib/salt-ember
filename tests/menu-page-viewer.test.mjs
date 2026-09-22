import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const viewerPath = new URL(
  "../components/ui/menu-page-viewer.tsx",
  import.meta.url,
);
const carouselPath = new URL(
  "../components/ui/card-carousel.tsx",
  import.meta.url,
);
const menuPath = new URL("../components/menu.tsx", import.meta.url);

test("a menu card activation opens the native dialog viewer", () => {
  assert.equal(
    existsSync(viewerPath),
    true,
    "the reusable menu page viewer must exist",
  );

  const viewer = readFileSync(viewerPath, "utf8");
  const carousel = readFileSync(carouselPath, "utf8");
  const menu = readFileSync(menuPath, "utf8");

  assert.match(carousel, /onCardActivate\?: \(index: number, trigger: HTMLButtonElement\) => void/);
  assert.match(carousel, /onCardActivate\(index, event\.currentTarget\)/);
  assert.match(menu, /<MenuPageViewer[\s\S]*selectedPageIndex=/);
  assert.match(viewer, /dialog\.showModal\(\)/);
  assert.match(viewer, /onCancel=/);
  assert.match(viewer, /onClose=/);
  assert.match(viewer, /onPointerDown=/);
  assert.match(viewer, /aria-label="Close menu viewer"/);
});

test("the viewer displays a fitted page and keeps simple page navigation", () => {
  assert.equal(
    existsSync(viewerPath),
    true,
    "the reusable menu page viewer must exist",
  );

  const viewer = readFileSync(viewerPath, "utf8");

  assert.match(viewer, /<img[\s\S]*src=\{page\.imgUrl\}/);
  assert.match(viewer, /Retry/);
  assert.match(viewer, /onTouchStart=\{handleTouchStart\}/);
  assert.match(viewer, /onTouchEnd=\{handleTouchEnd\}/);
  assert.match(viewer, /getMenuPageSwipeDirection/);
  assert.match(viewer, /ArrowLeft/);
  assert.match(viewer, /ArrowRight/);
  assert.match(viewer, /window\.scrollTo\(0, scrollPosition\.current\)/);
  assert.doesNotMatch(viewer, /Menu image zoom/);
  assert.doesNotMatch(viewer, /react-zoom-pan-pinch/);
});

test("the dialog padding remains available for backdrop dismissal", () => {
  assert.equal(
    existsSync(viewerPath),
    true,
    "the reusable menu page viewer must exist",
  );

  const viewer = readFileSync(viewerPath, "utf8");

  assert.match(viewer, /<section[\s\S]*pointer-events-none/);
  assert.match(viewer, /pointer-events-auto/);
});
