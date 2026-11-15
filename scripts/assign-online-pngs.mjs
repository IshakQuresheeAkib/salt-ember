import fs from "node:fs";
import path from "node:path";
import { parseCsv } from "./import-food-menu.mjs";

function escapeCsvField(val) {
  if (val === undefined || val === null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
    return "\"" + str.replace(/"/g, "\"\"") + "\"";
  }
  return str;
}

async function main() {
  const cacheFile = path.resolve(process.cwd(), "scratch", "pngimg-urls-cache.json");
  if (!fs.existsSync(cacheFile)) {
    throw new Error("Cache file scratch/pngimg-urls-cache.json not found.");
  }
  const themePools = JSON.parse(fs.readFileSync(cacheFile, "utf8"));

  const csvFile = path.resolve(process.cwd(), "scratch", "menu-template.csv");
  const csvContent = fs.readFileSync(csvFile, "utf8");
  const dishes = parseCsv(csvContent);
  console.log(`Assigning high-accuracy online PNG URLs to ${dishes.length} dishes...`);

  const categoryIndex = {};
  const updatedRows = [];

  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    const cat = dish.category;
    const name = (dish.name || "").toLowerCase();
    const pool = themePools[cat] || [];
    if (!categoryIndex[cat]) categoryIndex[cat] = 0;

    let imageUrl = pool[categoryIndex[cat] % pool.length];
    categoryIndex[cat]++;

    if (cat === "starters") {
      if (name.includes("chicken") || name.includes("wings") || name.includes("basket")) {
        const chickenPool = (themePools["main-courses"] || []).filter((u) => u.includes("fried_chicken"));
        if (chickenPool.length) imageUrl = chickenPool[i % chickenPool.length];
      } else if (name.includes("shrimp") || name.includes("prawn") || name.includes("calamari")) {
        const shrimpPool = pool.filter((u) => u.includes("shrimps"));
        if (shrimpPool.length) imageUrl = shrimpPool[i % shrimpPool.length];
      } else if (name.includes("mushroom")) {
        const mushPool = pool.filter((u) => u.includes("mushroom"));
        if (mushPool.length) imageUrl = mushPool[0];
      } else if (name.includes("fries") || name.includes("poutine") || name.includes("chips")) {
        const friesPool = pool.filter((u) => u.includes("fries"));
        if (friesPool.length) imageUrl = friesPool[i % friesPool.length];
      } else if (name.includes("wonton")) {
        const dumplingPool = (themePools["thai-chinese"] || []).filter((u) => u.includes("dumplings"));
        if (dumplingPool.length) imageUrl = dumplingPool[i % dumplingPool.length];
      }
    } else if (cat === "main-courses") {
      if (name.includes("fish") || name.includes("dory")) {
        const schnitzelPool = pool.filter((u) => u.includes("schnitzel") || u.includes("fish"));
        if (schnitzelPool.length) imageUrl = schnitzelPool[i % schnitzelPool.length];
      }
    } else if (cat === "beverages") {
      const idNum = parseInt(((dish.id || "").match(/\d+/) || [0])[0], 10);
      const coffeePool = pool.filter((u) => u.includes("cappuccino") || u.includes("coffee"));
      const cocktailPool = pool.filter((u) => u.includes("cocktail"));
      const lemonadePool = pool.filter((u) => u.includes("lemonade"));
      const smoothiePool = pool.filter((u) => u.includes("smoothie"));
      if (idNum <= 18 && coffeePool.length > 0) {
        imageUrl = coffeePool[idNum % coffeePool.length];
      } else if (idNum <= 32 && smoothiePool.length > 0) {
        imageUrl = smoothiePool[idNum % smoothiePool.length];
      } else if (idNum <= 42 && cocktailPool.length > 0) {
        imageUrl = cocktailPool[idNum % cocktailPool.length];
      } else if (lemonadePool.length > 0) {
        imageUrl = lemonadePool[idNum % lemonadePool.length];
      }
    } else if (cat === "desserts") {
      if (name.includes("muffin")) {
        const muffinPool = pool.filter((u) => u.includes("muffin"));
        if (muffinPool.length) imageUrl = muffinPool[0];
      } else if (name.includes("oreo")) {
        const oreoPool = pool.filter((u) => u.includes("oreo") || u.includes("cake"));
        if (oreoPool.length) imageUrl = oreoPool[0];
      } else if (name.includes("chocolate") || name.includes("brownie")) {
        const chocPool = pool.filter((u) => u.includes("chocolate"));
        if (chocPool.length) imageUrl = chocPool[0];
      }
    }

    updatedRows.push({
      ...dish,
      imageUrl
    });
  }

  const headers = ["id", "name", "category", "price", "description", "portion", "isPopular", "isSpicy", "imageUrl"];
  const lines = [headers.join(",")];
  for (const r of updatedRows) {
    const rowVals = [
      r.id,
      r.name,
      r.category,
      r.price,
      r.description,
      r.portion,
      r.isPopular,
      r.isSpicy,
      r.imageUrl
    ];
    lines.push(rowVals.map(escapeCsvField).join(","));
  }

  fs.writeFileSync(csvFile, lines.join("\n") + "\n", "utf8");
  console.log(`Successfully updated ${updatedRows.length} dishes in ${csvFile}.`);
}

main().catch(console.error);
