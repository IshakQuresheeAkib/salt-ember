import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execSync } from "node:child_process";

test("export-menu-template.mjs generates valid CSV containing 136 dishes", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "salt-ember-export-"));
  const outputPath = path.join(tempDir, "menu-template.csv");

  try {
    execSync(`node scripts/export-menu-template.mjs --out "${outputPath}" --no-xlsx`, {
      stdio: "pipe",
    });

    assert.ok(fs.existsSync(outputPath), "CSV output file must exist");
    const content = fs.readFileSync(outputPath, "utf8");
    const lines = content.trim().split("\n");
    assert.equal(lines.length, 137, "Expected 1 header line + 136 dish rows");
    assert.match(
      lines[0],
      /^name,category,price,description,portion,isPopular,isSpicy,imageUrl/,
    );
    // Verify that exported prices do not contain 'TK'
    for (let i = 1; i < lines.length; i++) {
      assert.doesNotMatch(
        lines[i],
        /\bTK\b/i,
        `Row ${i + 1} should not contain 'TK': ${lines[i]}`,
      );
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
