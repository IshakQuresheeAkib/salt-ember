import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const componentPath = new URL("../components/ui/social-media.tsx", import.meta.url);
const dataPath = new URL("../lib/constants/social-media.ts", import.meta.url);
const pagePath = new URL("../app/page.tsx", import.meta.url);

test("shares live Facebook, Instagram, and WhatsApp controls between hero and footer", () => {
  assert.equal(
    existsSync(componentPath),
    true,
    "Expected a reusable social-media component",
  );

  const component = readFileSync(componentPath, "utf8");
  const data = readFileSync(dataPath, "utf8");
  const page = readFileSync(pagePath, "utf8");

  for (const platform of ["Facebook", "Instagram", "WhatsApp"]) {
    assert.match(data, new RegExp(`ariaLabel: "${platform}"`));
  }

  assert.match(data, /https:\/\/www\.facebook\.com\/saltandember7/);
  assert.match(data, /https:\/\/www\.instagram\.com\/salt\.and\.ember_/);
  assert.match(data, /https:\/\/wa\.me\/8801704083376/);
  assert.match(data, /kind: "call"/);
  assert.match(data, /SALT_AND_EMBER_MOBILE_NUMBER/);
  assert.match(component, /PhoneCall/);

  assert.match(page, /<SocialTooltip[^>]*className="hero-social-links"/);
  assert.match(page, /<SocialTooltip[^>]*className="footer-social-links"/);
  assert.doesNotMatch(page, /PhoneCall/);
  assert.equal((page.match(/<SocialTooltip/g) ?? []).length, 2);
});
