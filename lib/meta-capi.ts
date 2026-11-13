import "server-only";
import { createHash } from "node:crypto";

export const META_GRAPH_API_VERSION = "v22.0";

export interface SendMetaServerEventOptions {
  eventName: string;
  eventId: string;
  eventSourceUrl: string; // Strictly required by Meta for website events
  clientUserAgent: string; // Strictly required by Meta for matching
  clientIp?: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fbp?: string;
  fbc?: string;
  customData?: Record<string, unknown>;
}

/**
 * Normalizes phone number to digits only with country code (e.g. 8801704083376)
 * then produces lowercase SHA-256 hash as required by Meta.
 * Auto-prefixes Bangladesh country code (88) if given standard 11-digit local format (01...).
 */
export function normalizeAndHashPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("01") && digits.length === 11) {
    digits = "88" + digits;
  }
  return digits ? createHash("sha256").update(digits).digest("hex") : undefined;
}

/**
 * Normalizes string (trimmed, lowercased) and returns SHA-256 hash.
 */
export function normalizeAndHashString(val?: string): string | undefined {
  if (!val) return undefined;
  const clean = val.trim().toLowerCase();
  return clean ? createHash("sha256").update(clean).digest("hex") : undefined;
}

/**
 * Sends a server event to Meta Conversions API (Graph API)
 */
export async function sendMetaServerEvent(opts: SendMetaServerEventOptions): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Meta CAPI] Event skipped: META_PIXEL_ID or META_ACCESS_TOKEN is not configured."
      );
    }
    return;
  }

  if (!opts.eventSourceUrl || !opts.clientUserAgent) {
    console.error(
      "[Meta CAPI] Event skipped: eventSourceUrl and clientUserAgent are strictly required by Meta."
    );
    return;
  }

  // Prevent test event code from routing real ad conversions away from Meta's optimization engine in production
  const isProd = process.env.NODE_ENV === "production";
  const testEventCode = !isProd ? process.env.META_TEST_EVENT_CODE : undefined;

  const phHash = normalizeAndHashPhone(opts.phone);
  const emHash = normalizeAndHashString(opts.email);
  const fnHash = normalizeAndHashString(opts.firstName);
  const lnHash = normalizeAndHashString(opts.lastName);
  const countryHash = normalizeAndHashString("bd");

  const payload = {
    data: [
      {
        event_name: opts.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: opts.eventId,
        event_source_url: opts.eventSourceUrl,
        action_source: "website",
        user_data: {
          client_user_agent: opts.clientUserAgent,
          client_ip_address: opts.clientIp || undefined,
          ph: phHash ? [phHash] : undefined,
          em: emHash ? [emHash] : undefined,
          fn: fnHash ? [fnHash] : undefined,
          ln: lnHash ? [lnHash] : undefined,
          country: countryHash ? [countryHash] : undefined,
          fbp: opts.fbp || undefined,
          fbc: opts.fbc || undefined,
        },
        custom_data: opts.customData || {},
      },
    ],
    test_event_code: testEventCode || undefined,
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          access_token: accessToken,
        }),
        signal: AbortSignal.timeout(4000),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error("[Meta CAPI Error Response]", err || res.statusText);
    }
  } catch (err) {
    console.error("[Meta CAPI Dispatch Error]", err);
  }
}
