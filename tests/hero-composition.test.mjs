import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.HERO_BASE_URL ?? "http://localhost:3000";

test("keeps one ember curve fixed outside the animated dish scenes", async () => {
  const response = await fetch(baseUrl);

  assert.equal(response.ok, true, `Expected ${baseUrl} to render successfully`);

  const html = await response.text();
  const curves = html.match(/class="hero-dish-curve"/g);
  const scenes = html.match(
    /<div class="hero-dish-scene[^"]*">[\s\S]*?<\/div>/g,
  );

  assert.equal(curves?.length, 1, "Expected one fixed ember curve");
  assert.equal(scenes?.length, 4, "Expected one animated scene per food state");

  for (const scene of scenes) {
    assert.doesNotMatch(scene, /class="hero-dish-curve"/);
    assert.match(scene, /class="hero-dish"/);
  }
});
