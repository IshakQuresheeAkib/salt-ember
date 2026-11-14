import assert from "node:assert/strict";
import test from "node:test";
import {
  generateMenuStructuredData,
  parseDishOffer,
  resolveAbsoluteImageUrl,
} from "../lib/seo-schema.ts";
import { FOOD_CATEGORIES, FOOD_DISHES } from "../lib/constants/food-menu-data.ts";
import { siteConfig } from "../lib/constants/site.ts";

test("parseDishOffer parses single and multi-price formats into Schema.org offers", () => {
  const single = parseDishOffer("550 TK");
  assert.equal(single["@type"], "Offer");
  assert.equal(single.price, 550);
  assert.equal(single.priceCurrency, "BDT");

  const multiWithTwoUnits = parseDishOffer("250 TK / 550 TK");
  assert.equal(multiWithTwoUnits["@type"], "AggregateOffer");
  assert.equal(multiWithTwoUnits.lowPrice, 250);
  assert.equal(multiWithTwoUnits.highPrice, 550);
  assert.equal(multiWithTwoUnits.priceCurrency, "BDT");

  const multiWithOneUnit = parseDishOffer("850 / 1000 TK");
  assert.equal(multiWithOneUnit["@type"], "AggregateOffer");
  assert.equal(multiWithOneUnit.lowPrice, 850);
  assert.equal(multiWithOneUnit.highPrice, 1000);
  assert.equal(multiWithOneUnit.priceCurrency, "BDT");
});

test("parseDishOffer cleanly parses every dish price in FOOD_DISHES", () => {
  for (const dish of FOOD_DISHES) {
    const offer = parseDishOffer(dish.price);
    assert.equal(offer.priceCurrency, "BDT");
    if (offer["@type"] === "Offer") {
      assert.ok(offer.price > 0, `Expected positive price for ${dish.name}: got ${offer.price}`);
      assert.ok(!Number.isNaN(offer.price));
    } else {
      assert.equal(offer["@type"], "AggregateOffer");
      assert.ok(offer.lowPrice > 0, `Expected positive lowPrice for ${dish.name}`);
      assert.ok(offer.highPrice >= offer.lowPrice, `Expected highPrice >= lowPrice for ${dish.name}`);
    }
  }
});

test("resolveAbsoluteImageUrl returns absolute URLs for local and external images", () => {
  const siteUrl = "https://saltandember.com";
  assert.equal(
    resolveAbsoluteImageUrl("/images/menu/dish.jpg", siteUrl),
    "https://saltandember.com/images/menu/dish.jpg",
  );
  assert.equal(
    resolveAbsoluteImageUrl("https://lh3.googleusercontent.com/photo.jpg", siteUrl),
    "https://lh3.googleusercontent.com/photo.jpg",
  );
  assert.equal(resolveAbsoluteImageUrl(undefined, siteUrl), undefined);
});

test("generateMenuStructuredData builds valid Schema.org Menu graph", () => {
  const menu = generateMenuStructuredData(FOOD_CATEGORIES, FOOD_DISHES, siteConfig);

  assert.equal(menu["@type"], "Menu");
  assert.equal(menu["@id"], `${siteConfig.url}/#menu`);
  assert.equal(menu.url, `${siteConfig.url}/#menu`);
  assert.equal(menu.inLanguage, "en_BD");

  assert.ok(Array.isArray(menu.hasMenuSection));
  assert.equal(menu.hasMenuSection.length, FOOD_CATEGORIES.length);

  let totalItemsInSchema = 0;
  for (const section of menu.hasMenuSection) {
    assert.equal(section["@type"], "MenuSection");
    assert.ok(section.name);
    assert.ok(Array.isArray(section.hasMenuItem));

    for (const item of section.hasMenuItem) {
      totalItemsInSchema++;
      assert.equal(item["@type"], "MenuItem");
      assert.ok(item.name);
      assert.ok(item.offers);
      assert.equal(item.offers.priceCurrency, "BDT");

      if (item.image) {
        assert.ok(item.image.startsWith("https://") || item.image.startsWith("http://"));
      }
    }
  }

  assert.equal(totalItemsInSchema, FOOD_DISHES.length);

  // Must serialize cleanly to valid JSON-LD
  const serialized = JSON.stringify(menu);
  assert.ok(serialized.length > 0);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed["@type"], "Menu");
});
