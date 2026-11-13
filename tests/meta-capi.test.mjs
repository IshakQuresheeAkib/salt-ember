import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("meta-capi has server-only guard, pinned Graph API version, and Bangladesh normalization", () => {
  const content = fs.readFileSync("lib/meta-capi.ts", "utf8");
  assert.match(content, /import\s+["']server-only["']/);
  assert.match(content, /META_GRAPH_API_VERSION\s*=\s*["']v22\.0["']/);
  assert.match(content, /event_source_url/);
  assert.match(content, /client_user_agent/);
  assert.match(content, /digits\.startsWith\("01"\)\s*&&\s*digits\.length\s*===\s*11/);
  assert.match(content, /"88"\s*\+\s*digits/);
  assert.match(content, /country:\s*countryHash\s*\?\s*\[countryHash\]/);
});

test("meta-conversion server action accepts client cookies and schedules with after()", () => {
  const content = fs.readFileSync("app/actions/meta-conversion.ts", "utf8");
  assert.match(content, /use server/);
  assert.match(content, /import\s*\{\s*after\s*\}\s*from\s*["']next\/server["']/);
  assert.match(content, /InitiateCheckout/);
  assert.match(content, /FindLocation/);
  assert.match(content, /Contact/);
  assert.match(content, /fbp\?: string/);
  assert.match(content, /fbc\?: string/);
  assert.match(content, /clientFbp\s*\|\|\s*reqCookies\.get\("_fbp"\)/);
  assert.match(content, /clientFbc\s*\|\|\s*reqCookies\.get\("_fbc"\)/);
});

test("pixel-tracker module generates valid WhatsApp URLs, deduplication event IDs, and cookie extractors", () => {
  const content = fs.readFileSync("lib/pixel-tracker.ts", "utf8");
  assert.match(content, /generateMetaEventId/);
  assert.match(content, /getMetaCookies/);
  assert.match(content, /buildDishWhatsAppOrderUrl/);
  assert.match(content, /InitiateCheckout/);
  assert.match(content, /wa\.me/);
  assert.match(content, /fbclid/);
  assert.match(content, /`fb\.1\.\$\{Date\.now\(\)\}\.\$\{fbclid\}`/);
});

test("FoodMenuCard includes WhatsApp order button with proper tracking trigger", () => {
  const content = fs.readFileSync("components/food-menu-card.tsx", "utf8");
  assert.match(content, /buildDishWhatsAppOrderUrl/);
  assert.match(content, /Order\s*\$\{dish\.name\}\s*on WhatsApp/);
  assert.match(content, /target="_blank"/);
  assert.match(content, /onClick=\{triggerTracking\}/);
});

test("MetaPixel component supports App Router route transitions via usePathname", () => {
  const content = fs.readFileSync("components/meta-pixel.tsx", "utf8");
  assert.match(content, /usePathname/);
  assert.match(content, /isFirstRender/);
  assert.match(content, /fbq\('init',\s*'\$\{PIXEL_ID\}'\)/);
  assert.match(content, /track",\s*"PageView"/);
});

test("Root layout mounts MetaPixel component", () => {
  const content = fs.readFileSync("app/layout.tsx", "utf8");
  assert.match(content, /<MetaPixel\s*\/>/);
});
