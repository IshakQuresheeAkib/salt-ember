import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { execSync } from "node:child_process";

test("export-menu-template.mjs generates valid CSV containing 136 dishes", () => {
  const outputPath = path.resolve(process.cwd(), "scratch", "menu-template.csv");
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

  execSync("node scripts/export-menu-template.mjs", { stdio: "pipe" });

  assert.ok(fs.existsSync(outputPath), "CSV output file must exist");
  const content = fs.readFileSync(outputPath, "utf8");
  const lines = content.trim().split("\n");
  assert.equal(lines.length, 137, "Expected 1 header line + 136 dish rows");
  assert.match(
    lines[0],
    /^id,name,category,price,description,portion,isPopular,isSpicy,imageUrl/,
  );
});
