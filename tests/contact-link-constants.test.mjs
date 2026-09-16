import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const constantsPath = new URL("../lib/constants/social-media.ts", import.meta.url);
const headerPath = new URL("../components/header.tsx", import.meta.url);
const footerPath = new URL("../components/footer.tsx", import.meta.url);

test("shares the map and WhatsApp destinations through contact constants", () => {
  const constants = readFileSync(constantsPath, "utf8");
  const header = readFileSync(headerPath, "utf8");
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
  assert.match(header, /SALT_AND_EMBER_MAP_URL/);
  assert.match(header, /href=\{SALT_AND_EMBER_MAP_URL\}/);
  assert.match(footer, /SALT_AND_EMBER_MAP_URL/);
  assert.match(footer, /SALT_AND_EMBER_WHATSAPP_URL/);
  assert.match(footer, /href=\{SALT_AND_EMBER_MAP_URL\}/);
  assert.match(footer, /href=\{SALT_AND_EMBER_WHATSAPP_URL\}/);
});
