#!/usr/bin/env node
import fs from "node:fs";
import { createHash } from "node:crypto";

// 1. Safe env loader (.env.local takes precedence over .env)
for (const envFile of [".env.local", ".env"]) {
  if (fs.existsSync(envFile) && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envFile);
    } catch {}
  }
}

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const codeArg = args.find((a) => a.startsWith("--code="))?.split("=")[1];

const pixelId =
  process.env.META_PIXEL_ID ||
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  (isDryRun ? "DRY_RUN_PIXEL_ID" : "");

const token = (process.env.META_CAPI_TOKEN || (isDryRun ? "DRY_RUN_TOKEN" : ""))?.trim();

const testEventCode = (codeArg || process.env.META_TEST_EVENT_CODE || "").trim();

if (!isDryRun && (!pixelId || !token)) {
  console.error("❌ Missing META_PIXEL_ID or META_CAPI_TOKEN in environment.");
  console.error("   Configure these in .env.local or pass them in environment variables.");
  process.exit(1);
}

const sha256 = (str) =>
  createHash("sha256")
    .update(str.trim().toLowerCase())
    .digest("hex");

const testEventId = `verify_evt_${Date.now()}`;
const payload = {
  data: [
    {
      event_name: "InitiateCheckout",
      event_time: Math.floor(Date.now() / 1000),
      event_id: testEventId,
      event_source_url: "https://salt-ember.vercel.app/#dishes",
      action_source: "website",
      user_data: {
        client_user_agent: "Mozilla/5.0 (Verification-CLI; Salt&Ember/1.0)",
        client_ip_address: "127.0.0.1",
        ph: [sha256("8801700000000")],
        country: [sha256("bd")],
        fbp: "fb.1.1710000000.123456789",
      },
      custom_data: {
        currency: "BDT",
        value: 550,
        content_name: "Verification Test Dish",
        content_type: "product",
      },
    },
  ],
  ...(testEventCode ? { test_event_code: testEventCode } : {}),
};

if (isDryRun) {
  console.log("✔ [Dry-Run] Payload structure valid:");
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

try {
  // Token is passed in POST body, not URL query string, to avoid leaking in request logs
  const res = await fetch(`https://graph.facebook.com/v22.0/${pixelId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, access_token: token }),
    signal: AbortSignal.timeout(5000),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || (data && data.events_received === 0)) {
    console.error("❌ Meta Graph API Error:", data || res.statusText);
    if (data && data.error) {
      console.error(`   Message: ${data.error.message}`);
      console.error(`   Code: ${data.error.code} (Subcode: ${data.error.error_subcode || "none"})`);
    }
    process.exit(1);
  }

  console.log(`✔ Success! Event received by Meta Graph API. (events_received: ${data.events_received})`);
  console.log(`   Event ID: ${testEventId}`);
  if (testEventCode) {
    console.log(`👉 Open Meta Events Manager > Test events tab to verify test event code: ${testEventCode}`);
  } else {
    console.log("ℹ Note: No META_TEST_EVENT_CODE was set. Event was dispatched as live data.");
  }
} catch (err) {
  console.error("❌ Network or dispatch error:", err.message);
  process.exit(1);
}
