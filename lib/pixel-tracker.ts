"use client";

import {
  trackDishCheckoutAction,
  trackGeneralContactAction,
} from "@/app/actions/meta-conversion";
import { siteConfig } from "@/lib/constants/site";
import type { FoodItem } from "@/lib/constants/food-menu-data";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Generates an event ID for Meta deduplication between browser and server events.
 */
export function generateMetaEventId(): string {
  const rand = Math.random().toString(36).substring(2, 9);
  return `evt_${Date.now()}_${rand}`;
}

/**
 * Resolves _fbp and _fbc from browser cookies or URL parameters.
 * Synthesizes _fbc from ?fbclid= if the cookie is not yet set by the pixel script.
 */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};

  const cookies = Object.fromEntries(
    document.cookie.split("; ").filter(Boolean).map((c) => {
      const idx = c.indexOf("=");
      return [c.slice(0, idx), decodeURIComponent(c.slice(idx + 1))];
    })
  );

  let fbc = cookies._fbc;
  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp: cookies._fbp, fbc };
}

/**
 * Extracts numeric value from price strings (e.g. "550 TK" -> 550)
 */
export function parseNumericPrice(priceStr: string): number {
  const sanitized = priceStr.replace(/[^0-9.]/g, "");
  const num = parseFloat(sanitized);
  return Number.isNaN(num) ? 0 : num;
}

/**
 * Safely calls browser Meta Pixel
 */
export function trackClientPixel(
  eventName: string,
  params: Record<string, unknown> = {},
  eventId?: string
): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("track", eventName, params, { eventID: eventId });
    } else {
      window.fbq("track", eventName, params);
    }
  }
}

/**
 * Handles 'Order on WhatsApp' for food menu items:
 * 1. Generates deduplication eventId.
 * 2. Fires browser InitiateCheckout event.
 * 3. Dispatches Next.js Server Action for CAPI (with after()).
 * 4. Generates the pre-filled WhatsApp link.
 */
export function buildDishWhatsAppOrderUrl(dish: FoodItem): {
  whatsappUrl: string;
  triggerTracking: () => void;
} {
  const eventId = generateMetaEventId();
  const numericPrice = parseNumericPrice(dish.price);
  const cleanPhone = siteConfig.contact.telephoneRaw.replace(/\D/g, "");

  const message = `Hi ${siteConfig.name}! I would like to order: ${dish.name} (${dish.price}).`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const triggerTracking = () => {
    // 1. Browser Pixel event
    trackClientPixel(
      "InitiateCheckout",
      {
        content_name: dish.name,
        content_category: dish.category,
        content_ids: [dish.id],
        content_type: "product",
        currency: siteConfig.currenciesAccepted || "BDT",
        value: numericPrice,
        num_items: 1,
      },
      eventId
    );

    // 2. Server CAPI event (non-blocking)
    const { fbp, fbc } = getMetaCookies();
    trackDishCheckoutAction({
      dishId: dish.id,
      dishName: dish.name,
      price: dish.price,
      category: dish.category,
      eventId,
      fbp,
      fbc,
    }).catch((err) => {
      console.error("[CAPI Trigger error]", err);
    });
  };

  return { whatsappUrl, triggerTracking };
}

/**
 * Handles generic contact clicks (WhatsApp, Tel, Map)
 */
export function trackOutboundContactClick(channel: "whatsapp" | "telephone" | "map"): void {
  const eventId = generateMetaEventId();
  const eventName = channel === "map" ? "FindLocation" : "Contact";
  const { fbp, fbc } = getMetaCookies();

  // 1. Browser Pixel
  trackClientPixel(
    eventName,
    {
      contact_method: channel,
      currency: siteConfig.currenciesAccepted || "BDT",
    },
    eventId
  );

  // 2. Server CAPI (non-blocking)
  trackGeneralContactAction({ channel, eventId, fbp, fbc }).catch((err) => {
    console.error("[CAPI Contact Trigger error]", err);
  });
}
