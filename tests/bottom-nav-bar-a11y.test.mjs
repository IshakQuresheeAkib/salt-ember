import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const bottomNavPath = new URL(
  "../components/ui/bottom-nav-bar.tsx",
  import.meta.url,
);

test("bottom navigation keeps a visible keyboard focus indicator", () => {
  const bottomNav = readFileSync(bottomNavPath, "utf8");

  assert.match(
    bottomNav,
    /focus-visible:outline-2[\s\S]*focus-visible:outline-offset-4[\s\S]*focus-visible:outline-silver/,
  );
  assert.doesNotMatch(bottomNav, /focus-visible:ring-0/);
});

test("bottom navigation synchronizes its active item with hash navigation", () => {
  const bottomNav = readFileSync(bottomNavPath, "utf8");

  assert.match(bottomNav, /const getActiveIndexForHash = \(/);
  assert.match(bottomNav, /window\.addEventListener\("hashchange", syncActiveIndex\)/);
  assert.match(bottomNav, /window\.removeEventListener\("hashchange", syncActiveIndex\)/);
});
