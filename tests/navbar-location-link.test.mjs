import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const headerPath = new URL("../components/header.tsx", import.meta.url);
const heroPath = new URL("../components/hero-section.tsx", import.meta.url);

test("renders the external Maps action in the hero rather than the primary navbar", () => {
  const header = readFileSync(headerPath, "utf8");
  const hero = readFileSync(heroPath, "utf8");

  assert.doesNotMatch(header, /SALT_AND_EMBER_MAP_URL/);
  assert.match(hero, /import \{[^}]*MapPinned[^}]*\} from "lucide-react"/);
  assert.match(
    hero,
    /<Button[\s\S]*variant="secondary"[\s\S]*href=\{SALT_AND_EMBER_MAP_URL\}[\s\S]*target="_blank"[\s\S]*rel="noopener noreferrer"[\s\S]*<MapPinned[^>]*aria-hidden="true"[\s\S]*Our location/,
  );
});
