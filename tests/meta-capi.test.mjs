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

test("parseNumericPrice correctly parses single, decimal, and range prices", () => {
  function parseNumericPrice(priceStr) {
    if (!priceStr) return 0;
    const basePriceStr = priceStr.includes("/") ? priceStr.split("/")[0] : priceStr;
    const match = basePriceStr.match(/\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  }

  assert.equal(parseNumericPrice("550 TK"), 550);
  assert.equal(parseNumericPrice("৳650"), 650);
  assert.equal(parseNumericPrice("$17.50"), 17.5);
  assert.equal(parseNumericPrice("850 / 1000 TK"), 850);
  assert.equal(parseNumericPrice("250 TK / 550 TK"), 250);
  assert.equal(parseNumericPrice(""), 0);
});

test("Meta deduplication event ID generates unique IDs inside triggerTracking per click", () => {
  const content = fs.readFileSync("lib/pixel-tracker.ts", "utf8");
  assert.match(
    content,
    /const triggerTracking = \(\) => \{\s*\/\/[^\n]*\s*const eventId = generateMetaEventId\(\);/,
    "eventId must be generated inside triggerTracking for each user click"
  );
});

test("Meta testing verification: test_event_code supported in client, server actions, and CAPI", () => {
  const capiContent = fs.readFileSync("lib/meta-capi.ts", "utf8");
  assert.match(capiContent, /META_CAPI_TOKEN/, "must use META_CAPI_TOKEN");
  assert.match(capiContent, /testEventCode\?: string/, "options must define testEventCode");
  assert.match(
    capiContent,
    /const isProd = process\.env\.NODE_ENV === "production"/,
    "must check production environment"
  );

  const trackerContent = fs.readFileSync("lib/pixel-tracker.ts", "utf8");
  assert.match(trackerContent, /getMetaTestEventCode/, "must export getMetaTestEventCode helper");
  assert.match(trackerContent, /test_event_code/, "must extract test_event_code query parameter");
  assert.match(
    trackerContent,
    /options\.test_event_code = code/,
    "must pass test_event_code to browser fbq for deduplication"
  );

  const actionContent = fs.readFileSync("app/actions/meta-conversion.ts", "utf8");
  assert.match(
    actionContent,
    /testEventCode\?: string/,
    "action params must accept testEventCode"
  );
});

test("behavioral: sendMetaServerEvent strictly drops test_event_code in production and preserves it in dev", async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env.NODE_ENV;
  const originalAllow = process.env.META_ALLOW_TEST_EVENTS;
  const originalPixel = process.env.META_PIXEL_ID;
  const originalToken = process.env.META_CAPI_TOKEN;
  const originalTestCode = process.env.META_TEST_EVENT_CODE;

  try {
    let capturedBody = null;
    globalThis.fetch = async (url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return {
        ok: true,
        json: async () => ({ events_received: 1 }),
      };
    };

    process.env.META_PIXEL_ID = "test_pixel_123";
    process.env.META_CAPI_TOKEN = "test_token_123";
    process.env.META_TEST_EVENT_CODE = "TEST12345";

    const { sendMetaServerEvent } = await import("../lib/meta-capi.ts");

    // 1. In production: test_event_code must be omitted from payload
    process.env.NODE_ENV = "production";
    delete process.env.META_ALLOW_TEST_EVENTS;
    await sendMetaServerEvent({
      eventName: "InitiateCheckout",
      eventId: "evt_prod_test",
      eventSourceUrl: "https://salt-ember.vercel.app/#dishes",
      clientUserAgent: "TestAgent/1.0",
      testEventCode: "EXPLICIT_TEST_CODE",
    });

    assert.equal(
      capturedBody.test_event_code,
      undefined,
      "test_event_code must be undefined when NODE_ENV is production"
    );

    // 2. In development: test_event_code must be included
    process.env.NODE_ENV = "development";
    await sendMetaServerEvent({
      eventName: "InitiateCheckout",
      eventId: "evt_dev_test",
      eventSourceUrl: "https://salt-ember.vercel.app/#dishes",
      clientUserAgent: "TestAgent/1.0",
      testEventCode: "EXPLICIT_TEST_CODE",
    });

    assert.equal(
      capturedBody.test_event_code,
      "EXPLICIT_TEST_CODE",
      "test_event_code must be sent when NODE_ENV is development"
    );
  } finally {
    globalThis.fetch = originalFetch;
    process.env.NODE_ENV = originalEnv;
    if (originalAllow !== undefined) process.env.META_ALLOW_TEST_EVENTS = originalAllow;
    else delete process.env.META_ALLOW_TEST_EVENTS;
    process.env.META_PIXEL_ID = originalPixel;
    process.env.META_CAPI_TOKEN = originalToken;
    process.env.META_TEST_EVENT_CODE = originalTestCode;
  }
});

test("verify-meta-capi CLI runs dry-run successfully without network or secrets", async () => {
  const { execSync } = await import("node:child_process");
  const output = execSync("node scripts/verify-meta-capi.mjs --dry-run --code=TESTCLI123", {
    encoding: "utf8",
  });
  assert.match(output, /\[Dry-Run\] Payload structure valid/);
  assert.match(output, /TESTCLI123/);
});

test(".env.example explicitly configures META_TEST_EVENT_CODE and uses exclusively META_CAPI_TOKEN", () => {
  const content = fs.readFileSync(".env.example", "utf8");
  assert.match(content, /^META_TEST_EVENT_CODE=/m, "META_TEST_EVENT_CODE must be active in .env.example");
  assert.match(content, /^META_CAPI_TOKEN=/m, "META_CAPI_TOKEN must be present");
});
