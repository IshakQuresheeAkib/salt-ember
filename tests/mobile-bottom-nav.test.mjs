import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pagePath = new URL("../app/page.tsx", import.meta.url);
const headerPath = new URL("../components/header.tsx", import.meta.url);
const mobileNavPath = new URL("../components/mobile-bottom-nav.tsx", import.meta.url);
const bottomNavPath = new URL("../components/ui/bottom-nav-bar.tsx", import.meta.url);
const defaultNavItemsPath = new URL("../lib/constants/default-nav-items.ts", import.meta.url);

test("uses the bottom bar for each restaurant navigation anchor and location on mobile", () => {
  const page = readFileSync(pagePath, "utf8");
  const header = readFileSync(headerPath, "utf8");
  const mobileNav = readFileSync(mobileNavPath, "utf8");
  const bottomNav = readFileSync(bottomNavPath, "utf8");
  const defaultNavItems = readFileSync(defaultNavItemsPath, "utf8");

  assert.match(page, /<MobileBottomNav\s*\/>/);
  assert.match(page, /pb-20[\s\S]*desktop:pb-0/);
  assert.doesNotMatch(header, /<details/);

  for (const [label, href] of [
    ["Home", "#top"],
    ["Menu", "#menu"],
    ["Reviews", "#testimonials"],
    ["Contact", "#contact"],
  ]) {
    assert.match(
      defaultNavItems,
      new RegExp(`href: "${href}"[^}]*label: "${label}"`),
    );
  }

  assert.match(mobileNav, /const mobileNavigationItems/);
  assert.match(mobileNav, /SALT_AND_EMBER_MAP_URL/);
  assert.match(mobileNav, /label: "Location"/);
  assert.match(mobileNav, /external: true/);
  assert.match(header, /defaultNavItems\.map/);
  assert.match(header, /const Icon = item\.icon/);
  assert.match(header, /<Icon aria-hidden="true"/);
  assert.match(header, /hidden[\s\S]*desktop:inline-flex/);
  assert.match(mobileNav, /stickyBottom/);
  assert.match(mobileNav, /desktop:hidden/);
  assert.match(mobileNav, /!right-\[max\(1rem,env\(safe-area-inset-right\)\)\]/);
  assert.match(bottomNav, /aria-label="Bottom navigation"/);
  assert.match(bottomNav, /aria-current/);
  assert.match(bottomNav, /target=\{item\.external \? "_blank" : undefined\}/);
});
