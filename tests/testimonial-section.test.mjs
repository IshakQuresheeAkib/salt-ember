import assert from "node:assert/strict";
import test from "node:test";

const baseUrl =
  process.env.TESTIMONIAL_BASE_URL ?? "http://localhost:3002";

test("renders the pausable Salt & Ember testimonial columns", async () => {
  const response = await fetch(baseUrl);

  assert.equal(response.ok, true, `Expected ${baseUrl} to render successfully`);

  const html = await response.text();
  const primaryCards = html.match(/data-testimonial-card="primary"/g);
  const duplicateCards = html.match(/data-testimonial-card="duplicate"/g);

  assert.match(
    html,
    /<section[^>]+id="testimonials"[^>]+aria-labelledby="testimonials-heading"/,
  );
  assert.match(html, /id="testimonials-heading"/);
  assert.match(html, /What they/);
  assert.match(html, /say/);
  assert.match(html, /aria-label="Pause testimonial movement"/);
  assert.equal(primaryCards?.length, 9, "Expected nine readable testimonials");
  assert.equal(
    duplicateCards?.length,
    9,
    "Expected one hidden duplicate of every testimonial for the loop",
  );
  assert.doesNotMatch(html, /aria-label="Toggle Dark Mode"/);
});
