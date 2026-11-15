import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { FOOD_DISHES } from "../lib/constants/food-menu-data.ts";

function escapeCsvField(val) {
  if (val === undefined || val === null) return "";
  const str = String(val);
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function cleanPriceForExport(priceStr) {
  if (!priceStr) return "";
  return priceStr
    .replace(/\s*TK\s*/gi, "")
    .split("/")
    .map((p) => p.trim())
    .join(" / ");
}

const headers = [
  "name",
  "category",
  "price",
  "description",
  "portion",
  "isPopular",
  "isSpicy",
  "imageUrl",
];

const rows = [headers.join(",")];

for (const dish of FOOD_DISHES) {
  rows.push(
    [
      escapeCsvField(dish.name),
      escapeCsvField(dish.category),
      escapeCsvField(cleanPriceForExport(dish.price)),
      escapeCsvField(dish.description || ""),
      escapeCsvField(dish.portion || ""),
      escapeCsvField(dish.isPopular ? "TRUE" : "FALSE"),
      escapeCsvField(dish.isSpicy ? "TRUE" : "FALSE"),
      escapeCsvField(dish.image || ""),
    ].join(","),
  );
}

const args = process.argv.slice(2);
const outArgIndex = args.indexOf("--out");
const skipXlsx = args.includes("--no-xlsx");

const scratchDir = path.resolve(process.cwd(), "scratch");
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

const outputPath =
  outArgIndex !== -1 && args[outArgIndex + 1]
    ? path.resolve(args[outArgIndex + 1])
    : path.join(scratchDir, "menu-template.csv");

fs.writeFileSync(outputPath, rows.join("\n") + "\n", "utf8");
console.log(`Exported ${FOOD_DISHES.length} dishes to ${outputPath}`);

// Generate interactive Excel spreadsheet template with dropdowns and boolean controls
if (!skipXlsx) {
  try {
    const pyScript = path.resolve(
      process.cwd(),
      "scripts",
      "generate-menu-spreadsheet.py",
    );
    if (fs.existsSync(pyScript)) {
      execSync(`python "${pyScript}"`, { stdio: "inherit" });
    }
  } catch {
    // Progressive enhancement
  }
}

