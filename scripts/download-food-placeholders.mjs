import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { parseCsv } from "./import-food-menu.mjs";

const CATEGORY_THEMES = {
  "beef-steaks": ["https://pngimg.com/images/food/steak"],
  "slow-cooked": ["https://pngimg.com/images/food/barbecue", "https://pngimg.com/images/food/meat"],
  "pizza": ["https://pngimg.com/images/food/pizza"],
  "pasta-spaghetti": ["https://pngimg.com/images/food/pasta", "https://pngimg.com/images/food/spaghetti"],
  "soups-noodles": ["https://pngimg.com/images/food/soup", "https://pngimg.com/images/food/ramen", "https://pngimg.com/images/food/noodle"],
  "salads": ["https://pngimg.com/images/food/salad"],
  "main-courses": ["https://pngimg.com/images/food/fried_chicken", "https://pngimg.com/images/animals/fish", "https://pngimg.com/images/food/schnitzel"],
  "thai-chinese": ["https://pngimg.com/images/food/rice", "https://pngimg.com/images/food/dumplings", "https://pngimg.com/images/food/fried_chicken"],
  "kebabs-naan": ["https://pngimg.com/images/food/kebab", "https://pngimg.com/images/food/shashlik", "https://pngimg.com/images/food/bread"],
  "biryani": ["https://pngimg.com/images/food/rice"],
  "sides": ["https://pngimg.com/images/food/fries", "https://pngimg.com/images/vegetables/potato", "https://pngimg.com/images/food/rice"],
  "starters": [
    "https://pngimg.com/images/animals/shrimps",
    "https://pngimg.com/images/food/fries",
    "https://pngimg.com/images/nature/mushroom",
    "https://pngimg.com/images/food/fried_chicken",
    "https://pngimg.com/images/food/dumplings"
  ],
  "desserts": [
    "https://pngimg.com/images/food/cake",
    "https://pngimg.com/images/food/chocolate_cake",
    "https://pngimg.com/images/food/muffin",
    "https://pngimg.com/images/food/oreo"
  ],
  "beverages": [
    "https://pngimg.com/images/food/cappuccino",
    "https://pngimg.com/images/food/mug_coffee",
    "https://pngimg.com/images/food/smoothie",
    "https://pngimg.com/images/food/cocktail",
    "https://pngimg.com/images/food/lemonade",
    "https://pngimg.com/images/food/tea"
  ]
};

async function fetchThemeUrls(themeUrl) {
  try {
    const res = await fetch(themeUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return [];
    const html = await res.text();
    const pngs = [...new Set(html.match(/https:\/\/pngimg\.com\/uploads\/[^\/]+\/[^"\s]+\.png/g) || [])];
    return pngs.filter((p) => !p.includes("/small/"));
  } catch (err) {
    console.warn(`Failed to fetch theme ${themeUrl}: ${err.message}`);
    return [];
  }
}

async function downloadAndOptimize(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const optimized = await sharp(buffer)
    .resize(500, 500, { fit: "inside", withoutEnlargement: true })
    .png({ quality: 85, compressionLevel: 8 })
    .toBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, optimized);
}

async function main() {
  const csvFile = path.resolve(process.cwd(), "scratch", "menu-template.csv");
  const csvContent = fs.readFileSync(csvFile, "utf8");
  const dishes = parseCsv(csvContent);
  console.log(`Processing ${dishes.length} dishes...`);

  // Cache theme pools
  const themePools = {};
  for (const [cat, urls] of Object.entries(CATEGORY_THEMES)) {
    console.log(`Loading image pool for category: ${cat}...`);
    const allPngs = [];
    for (const u of urls) {
      const pngs = await fetchThemeUrls(u);
      allPngs.push(...pngs);
    }
    themePools[cat] = [...new Set(allPngs)];
    console.log(`  -> ${themePools[cat].length} images available for ${cat}`);
  }

  const categoryIndex = {};
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    const cat = dish.category;
    const pool = themePools[cat] || [];
    if (!categoryIndex[cat]) categoryIndex[cat] = 0;

    let imageUrl = pool[categoryIndex[cat] % pool.length];
    categoryIndex[cat]++;

    // Special thematic sub-selection where appropriate
    if (cat === "beverages") {
      const idNum = parseInt((dish.id.match(/\d+/) || [0])[0], 10);
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
    } else if (cat === "starters") {
      const name = dish.name.toLowerCase();
      if (name.includes("shrimp") || name.includes("prawn")) {
        const shrimpPool = pool.filter((u) => u.includes("shrimps"));
        if (shrimpPool.length) imageUrl = shrimpPool[i % shrimpPool.length];
      } else if (name.includes("mushroom")) {
        const mushPool = pool.filter((u) => u.includes("mushroom"));
        if (mushPool.length) imageUrl = mushPool[0];
      } else if (name.includes("fries") || name.includes("poutine")) {
        const friesPool = pool.filter((u) => u.includes("fries"));
        if (friesPool.length) imageUrl = friesPool[i % friesPool.length];
      } else if (name.includes("wonton") || name.includes("basket") || name.includes("wings")) {
        const friedPool = pool.filter((u) => u.includes("fried_chicken") || u.includes("dumplings"));
        if (friedPool.length) imageUrl = friedPool[i % friedPool.length];
      }
    } else if (cat === "desserts") {
      const name = dish.name.toLowerCase();
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

    const destPath = path.resolve(process.cwd(), "public", "images", "menu", cat, `${dish.id}.png`);
    try {
      await downloadAndOptimize(imageUrl, destPath);
      console.log(`[${i + 1}/${dishes.length}] Saved ${dish.id}.png (${cat})`);
      successCount++;
    } catch (err) {
      console.error(`[${i + 1}/${dishes.length}] FAILED ${dish.id}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\nDownload completed: ${successCount} successful, ${failCount} failed.`);
}

main().catch(console.error);
