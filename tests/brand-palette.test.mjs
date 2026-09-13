import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.HERO_BASE_URL ?? "http://localhost:3000";

const approvedPalette = [
  "#ffd9a3",
  "#ffb45c",
  "#f28b2c",
  "#c35a1a",
  "#7a2e0b",
  "#1a0d06",
];

const retiredPalette = [
  "#0b0a09",
  "#181513",
  "#332d29",
  "#fff4e8",
  "#b8a99a",
  "#e84520",
  "#f6531a",
  "#ffaa20",
  "#a7281a",
];

test("serves the approved amber brand palette without retired colors", async () => {
  const pageResponse = await fetch(baseUrl);
  assert.equal(pageResponse.ok, true, `Expected ${baseUrl} to render successfully`);

  const html = await pageResponse.text();
  const stylesheetPaths = Array.from(
    html.matchAll(/<link[^>]+href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/g),
    (match) => match[1],
  );

  assert.ok(stylesheetPaths.length > 0, "Expected the page to load a stylesheet");

  const stylesheets = await Promise.all(
    stylesheetPaths.map(async (path) => {
      const response = await fetch(new URL(path, baseUrl));
      assert.equal(response.ok, true, `Expected ${path} to load successfully`);
      return response.text();
    }),
  );
  const css = stylesheets.join("\n").toLowerCase();

  for (const color of approvedPalette) {
    assert.match(css, new RegExp(color), `Expected compiled CSS to include ${color}`);
  }

  for (const color of retiredPalette) {
    assert.doesNotMatch(css, new RegExp(color), `Expected compiled CSS to retire ${color}`);
  }
});
