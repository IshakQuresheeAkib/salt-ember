import fs from "node:fs";
import path from "node:path";
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

const headers = [
  "id",
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
      escapeCsvField(dish.id),
      escapeCsvField(dish.name),
      escapeCsvField(dish.category),
      escapeCsvField(dish.price),
      escapeCsvField(dish.description),
      escapeCsvField(dish.portion || ""),
      escapeCsvField(dish.isPopular ? "TRUE" : "FALSE"),
      escapeCsvField(dish.isSpicy ? "TRUE" : "FALSE"),
      escapeCsvField(dish.image || ""),
    ].join(","),
  );
}

const scratchDir = path.resolve(process.cwd(), "scratch");
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

const outputPath = path.join(scratchDir, "menu-template.csv");
fs.writeFileSync(outputPath, rows.join("\n") + "\n", "utf8");
console.log(`Exported ${FOOD_DISHES.length} dishes to ${outputPath}`);
