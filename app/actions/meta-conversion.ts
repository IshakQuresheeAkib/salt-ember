"use server";

import { headers, cookies } from "next/headers";
import { after } from "next/server";
import { sendMetaServerEvent } from "@/lib/meta-capi";
import { siteConfig } from "@/lib/constants/site";
import { FOOD_DISHES } from "@/lib/constants/food-menu-data";

export interface DishCheckoutTrackParams {
  dishId: string;
  dishName: string;
  price: string;
  category?: string;
  eventId: string;
  fbp?: string;
  fbc?: string;
}

export interface GeneralContactTrackParams {
  channel: "whatsapp" | "telephone" | "map";
  eventId: string;
  fbp?: string;
  fbc?: string;
}

/**
 * Parses numeric value from price strings like "550 TK", "$17.00", "850 / 1000 TK"
 */
function extractNumericPrice(priceStr: string): number {
  if (!priceStr) return 0;
  const basePriceStr = priceStr.includes("/") ? priceStr.split("/")[0] : priceStr;
  const match = basePriceStr.match(/\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * Resolves client metadata from request headers and cookies for high Event Match Quality (EMQ)
 */
async function getClientContext(clientFbp?: string, clientFbc?: string) {
  const reqHeaders = await headers();
  const reqCookies = await cookies();

  const userAgent = reqHeaders.get("user-agent") || "Mozilla/5.0";
  // Check Netlify IP header first, then Vercel/standard X-Forwarded-For
  const rawIp =
    reqHeaders.get("x-nf-client-connection-ip") ||
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

  const fbp = clientFbp || reqCookies.get("_fbp")?.value;
  const fbc = clientFbc || reqCookies.get("_fbc")?.value;

  return { userAgent, rawIp, fbp, fbc };
}

/**
 * Tracks dish order click as InitiateCheckout event via CAPI
 */
export async function trackDishCheckoutAction(params: DishCheckoutTrackParams): Promise<{ success: boolean }> {
  try {
    const { userAgent, rawIp, fbp, fbc } = await getClientContext(params.fbp, params.fbc);

    // Look up canonical dish data to avoid trusting untrusted client payload values directly
    const canonicalDish = FOOD_DISHES.find((d) => d.id === params.dishId);
    const dishName = canonicalDish ? canonicalDish.name : params.dishName;
    const category = canonicalDish ? canonicalDish.category : params.category;
    const priceStr = canonicalDish ? canonicalDish.price : params.price;
    const value = extractNumericPrice(priceStr);

    // after() ensures the background promise completes on serverless without delaying user response
    after(async () => {
      await sendMetaServerEvent({
        eventName: "InitiateCheckout",
        eventId: params.eventId,
        eventSourceUrl: `${siteConfig.url}/#dishes`,
        clientUserAgent: userAgent,
        clientIp: rawIp,
        fbp,
        fbc,
        customData: {
          content_name: dishName,
          content_category: category,
          content_ids: [params.dishId],
          content_type: "product",
          currency: siteConfig.currenciesAccepted || "BDT",
          value,
          num_items: 1,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("[trackDishCheckoutAction error]", error);
    return { success: false };
  }
}

/**
 * Tracks outbound clicks (WhatsApp, Tel, Map) as Contact or FindLocation event via CAPI
 */
export async function trackGeneralContactAction(params: GeneralContactTrackParams): Promise<{ success: boolean }> {
  try {
    const { userAgent, rawIp, fbp, fbc } = await getClientContext(params.fbp, params.fbc);
    const eventName = params.channel === "map" ? "FindLocation" : "Contact";

    after(async () => {
      await sendMetaServerEvent({
        eventName,
        eventId: params.eventId,
        eventSourceUrl: siteConfig.url,
        clientUserAgent: userAgent,
        clientIp: rawIp,
        fbp,
        fbc,
        customData: {
          contact_method: params.channel,
          currency: siteConfig.currenciesAccepted || "BDT",
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("[trackGeneralContactAction error]", error);
    return { success: false };
  }
}
