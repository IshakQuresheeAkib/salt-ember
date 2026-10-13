import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layoutPath = new URL("../app/layout.tsx", import.meta.url);
const robotsPath = new URL("../app/robots.ts", import.meta.url);
const sitemapPath = new URL("../app/sitemap.ts", import.meta.url);
const siteConstantsPath = new URL("../lib/constants/site.ts", import.meta.url);
const nextConfigPath = new URL("../next.config.ts", import.meta.url);

test("robots.ts allows root crawling and points to sitemap.xml", () => {
  const content = readFileSync(robotsPath, "utf8");
  assert.match(content, /userAgent:\s*"\*"/);
  assert.match(content, /allow:\s*"\/"/);
  assert.match(content, /sitemap:\s*`\${siteConfig\.url}\/sitemap\.xml`/);
});

test("sitemap.ts returns url with weekly change frequency and top priority", () => {
  const content = readFileSync(sitemapPath, "utf8");
  assert.match(content, /url:\s*siteConfig\.url/);
  assert.match(content, /changeFrequency:\s*"weekly"/);
  assert.match(content, /priority:\s*1\.0/);
});

test("site.ts includes complete local SEO definitions and geographic coordinates", () => {
  const content = readFileSync(siteConstantsPath, "utf8");
  assert.match(content, /streetAddress:\s*"Baruthkhana Point, East Zindabazar"/);
  assert.match(content, /addressLocality:\s*"Sylhet"/);
  assert.match(content, /postalCode:\s*"3100"/);
  assert.match(content, /latitude:\s*24\.8949/);
  assert.match(content, /longitude:\s*91\.8687/);
  assert.match(content, /priceRange:\s*"\$\$"/);
  assert.match(content, /currenciesAccepted:\s*"BDT"/);
  assert.match(content, /servesCuisine:/);
});

test("layout.tsx renders Restaurant & WebSite JSON-LD structured data", () => {
  const content = readFileSync(layoutPath, "utf8");
  assert.match(content, /"@type":\s*"Restaurant"/);
  assert.match(content, /"@type":\s*"WebSite"/);
  assert.match(content, /"@type":\s*"GeoCoordinates"/);
  assert.match(content, /hasMenu:\s*`\${siteConfig\.url}\/#menu`/);
  assert.match(content, /canonical:\s*"\/"/);
  assert.match(content, /openGraph:\s*\{/);
  assert.match(content, /twitter:\s*\{/);
});

test("next.config.ts configures security headers for SEO trust signals", () => {
  const content = readFileSync(nextConfigPath, "utf8");
  assert.match(content, /X-Content-Type-Options/);
  assert.match(content, /X-Frame-Options/);
  assert.match(content, /Referrer-Policy/);
  assert.match(content, /Strict-Transport-Security/);
});
