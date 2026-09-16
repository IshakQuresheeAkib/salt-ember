import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const constantsPath = new URL("../lib/constants/social-media.ts", import.meta.url);
const heroPath = new URL("../components/hero-section.tsx", import.meta.url);
const footerPath = new URL("../components/footer.tsx", import.meta.url);

test("shares the map and WhatsApp destinations through contact constants", () => {
  const constants = readFileSync(constantsPath, "utf8");
  const hero = readFileSync(heroPath, "utf8");
  const footer = readFileSync(footerPath, "utf8");

  assert.match(
    constants,
    /export const SALT_AND_EMBER_MAP_URL = "https:\/\/maps\.app\.goo\.gl\/qBEyyTSasUwqyaRs5"/,
  );
  assert.match(
    constants,
    /export const SALT_AND_EMBER_WHATSAPP_URL = "https:\/\/wa\.me\/8801704083376"/,
  );
  assert.match(constants, /href: SALT_AND_EMBER_WHATSAPP_URL/);
  assert.match(hero, /SALT_AND_EMBER_MAP_URL/);
  assert.match(hero, /href=\{SALT_AND_EMBER_MAP_URL\}/);
  assert.match(hero, /target="_blank"/);
  assert.match(hero, /rel="noopener noreferrer"/);
  assert.match(footer, /SALT_AND_EMBER_MAP_URL/);
  assert.match(footer, /SALT_AND_EMBER_WHATSAPP_URL/);
  assert.match(footer, /href=\{SALT_AND_EMBER_MAP_URL\}/);
  assert.match(footer, /href=\{SALT_AND_EMBER_WHATSAPP_URL\}/);
});
