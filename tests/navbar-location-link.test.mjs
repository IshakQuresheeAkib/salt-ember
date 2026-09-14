import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pagePath = new URL("../app/page.tsx", import.meta.url);
const stylesheetPath = new URL("../app/globals.css", import.meta.url);

test("renders an accessible animated Maps link at the right side of the navbar", () => {
  const page = readFileSync(pagePath, "utf8");
  const stylesheet = readFileSync(stylesheetPath, "utf8");

  assert.match(page, /import \{[^}]*MapPin[^}]*\} from "lucide-react"/);
  assert.match(
    page,
    /<a\s+className="navbar-location"[\s\S]*href="https:\/\/maps\.app\.goo\.gl\/qBEyyTSasUwqyaRs5"[\s\S]*target="_blank"[\s\S]*rel="noopener noreferrer"[\s\S]*aria-label="Open Salt & Ember's location in Google Maps"[\s\S]*<MapPin[^>]*aria-hidden="true"/,
  );
  assert.match(stylesheet, /\.navbar-location\s*\{/);
  assert.match(stylesheet, /\.navbar-location__pin\s*\{[\s\S]*animation:/);
  assert.match(stylesheet, /@keyframes navbar-location-bob/);
  assert.match(stylesheet, /\.navbar-location:focus-visible/);
});
