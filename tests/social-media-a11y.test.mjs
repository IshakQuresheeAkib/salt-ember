import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const componentPath = new URL(
  "../components/ui/social-media.tsx",
  import.meta.url,
);

test("social link tooltips stay out of the accessibility tree", () => {
  const component = readFileSync(componentPath, "utf8");

  assert.match(component, /<span\s+aria-hidden="true"\s+className=\{socialTooltipClassName\}/);
  assert.doesNotMatch(component, /role="tooltip"/);
});

test("social links show a local fallback when a remote icon fails", () => {
  const component = readFileSync(componentPath, "utf8");

  assert.match(component, /const \[hasIconError, setHasIconError\] = React\.useState\(false\)/);
  assert.match(component, /onError=\{\(\) => setHasIconError\(true\)\}/);
  assert.match(component, /item\.ariaLabel\.slice\(0, 2\)/);
});
