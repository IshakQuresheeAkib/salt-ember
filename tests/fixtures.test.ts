import { describe, expect, it } from "vitest";

import { galleryItems } from "@/lib/constants/gallery";
import { menuItems } from "@/lib/constants/menu";
import { navItems } from "@/lib/constants/nav";
import { restaurantDetails } from "@/lib/constants/restaurant";
import { testimonials } from "@/lib/constants/testimonials";

describe("public fixture contract", () => {
  it("uses unique homepage anchors and no commerce destinations", () => {
    const hrefs = navItems.map((item) => item.href);

    expect(hrefs).toEqual([
      "#top",
      "#about",
      "#menu",
      "#gallery",
      "#reservations",
      "#contact",
    ]);
    expect(new Set(hrefs).size).toBe(navItems.length);
  });

  it("keeps menu data provisional and denominated in BDT", () => {
    expect(menuItems.length).toBeGreaterThanOrEqual(8);
    expect(menuItems.every((item) => Number.isInteger(item.priceBdt))).toBe(true);
    expect(menuItems.every((item) => item.priceBdt > 0)).toBe(true);
    expect(menuItems.every((item) => item.isProvisional)).toBe(true);
    expect(menuItems.some((item) => item.isFeatured)).toBe(true);
  });

  it("gives all public imagery meaningful alternative text", () => {
    expect(galleryItems.length).toBeGreaterThanOrEqual(6);
    expect(galleryItems.every((item) => item.alt.trim().length > 0)).toBe(true);
    expect(menuItems.every((item) => item.alt.trim().length > 0)).toBe(true);
  });

  it("marks restaurant and testimonial content as provisional", () => {
    expect(restaurantDetails.isProvisional).toBe(true);
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
    expect(testimonials.every((item) => item.isProvisional)).toBe(true);
  });

  it("does not include commerce actions in public content", () => {
    const fixtureCopy = JSON.stringify({ menuItems, navItems, restaurantDetails });

    expect(fixtureCopy).not.toMatch(/order now|cart|delivery|favourite|shop/i);
  });
});
