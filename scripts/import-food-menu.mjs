import fs from "node:fs";
import path from "node:path";

export const VALID_CATEGORIES = new Set([
  "starters",
  "soups-noodles",
  "salads",
  "beef-steaks",
  "slow-cooked",
  "main-courses",
  "pasta-spaghetti",
  "pizza",
  "thai-chinese",
  "kebabs-naan",
  "biryani",
  "sides",
  "beverages",
  "desserts",
]);

export function parseCsv(csvString) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;
  const str = csvString.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  while (i < str.length) {
    const char = str[i];
    const nextChar = str[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ",") {
        currentRow.push(currentField.trim());
        currentField = "";
        i++;
        continue;
      } else if (char === "\n") {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.replace(/^"|"$/g, "").trim());
  const dataObjects = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c] !== undefined ? row[c] : "";
    }
    dataObjects.push(obj);
  }

  return dataObjects;
}

export function validateDishRows(rows) {
  const errors = [];
  const dishes = [];
  const seenIds = new Set();

  rows.forEach((row, idx) => {
    const lineNum = idx + 2;
    const id = (row.id || "").trim();
    const name = (row.name || "").trim();
    const category = (row.category || "").trim();
    const price = (row.price || "").trim();
    const description = (row.description || "").trim();
    const portion = (row.portion || "").trim();
    const isPopular = /^(true|yes|1)$/i.test((row.isPopular || "").trim());
    const isSpicy = /^(true|yes|1)$/i.test((row.isSpicy || "").trim());
    const imageUrl = (row.imageUrl || "").trim();

    if (!id) {
      errors.push(`Row ${lineNum}: Missing dish id.`);
    } else if (seenIds.has(id)) {
      errors.push(`Row ${lineNum}: Duplicate dish id '${id}'.`);
    } else {
      seenIds.add(id);
    }

    if (!name) {
      errors.push(`Row ${lineNum} ('${id || "unnamed"}'): Missing dish name.`);
    }

    if (!category) {
      errors.push(`Row ${lineNum} ('${id || "unnamed"}'): Missing dish category.`);
    } else if (!VALID_CATEGORIES.has(category)) {
      errors.push(
        `Row ${lineNum} ('${id || "unnamed"}'): Invalid category slug '${category}'. Valid categories are: ${Array.from(VALID_CATEGORIES).join(", ")}`,
      );
    }

    if (!price) {
      errors.push(`Row ${lineNum} ('${id || "unnamed"}'): Missing dish price.`);
    }

    if (!description) {
      errors.push(`Row ${lineNum} ('${id || "unnamed"}'): Missing dish description.`);
    }

    if (imageUrl && !imageUrl.startsWith("https://") && !imageUrl.startsWith("/")) {
      errors.push(
        `Row ${lineNum} ('${id || "unnamed"}'): Image URL must be an https URL or local path starting with '/'. Received: '${imageUrl}'`,
      );
    }

    const dish = {
      id,
      name,
      category,
      price,
      description,
    };
    if (portion) dish.portion = portion;
    if (isPopular) dish.isPopular = true;
    if (isSpicy) dish.isSpicy = true;
    if (imageUrl) dish.image = imageUrl;

    dishes.push(dish);
  });

  return {
    valid: errors.length === 0,
    errors,
    dishes,
  };
}

export function generateTypeScriptCode(existingSource, dishes) {
  const marker = "export const FOOD_DISHES: FoodItem[] = [";
  const markerIndex = existingSource.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(
      "Could not find 'export const FOOD_DISHES: FoodItem[] = [' in source file.",
    );
  }

  const prefix = existingSource.slice(0, markerIndex);
  const formattedDishes = dishes
    .map((dish) => {
      const lines = [
        `  {`,
        `    id: ${JSON.stringify(dish.id)},`,
        `    name: ${JSON.stringify(dish.name)},`,
        `    category: ${JSON.stringify(dish.category)},`,
        `    price: ${JSON.stringify(dish.price)},`,
        `    description: ${JSON.stringify(dish.description)},`,
      ];
      if (dish.portion) {
        lines.push(`    portion: ${JSON.stringify(dish.portion)},`);
      }
      if (dish.isPopular) {
        lines.push(`    isPopular: true,`);
      }
      if (dish.isSpicy) {
        lines.push(`    isSpicy: true,`);
      }
      if (dish.image) {
        lines.push(`    image: ${JSON.stringify(dish.image)},`);
      }
      lines.push(`  },`);
      return lines.join("\n");
    })
    .join("\n");

  return `${prefix}${marker}\n${formattedDishes}\n];\n`;
}

async function main() {
  const args = process.argv.slice(2);
  const writeFlag = args.includes("--write");
  const fileArgs = args.filter((a) => !a.startsWith("--"));
  const csvFile =
    fileArgs[0] || path.resolve(process.cwd(), "scratch", "menu-template.csv");

  if (!fs.existsSync(csvFile)) {
    console.error(`CSV file not found: ${csvFile}`);
    process.exit(1);
  }

  console.log(`Reading menu CSV from: ${csvFile}`);
  const csvContent = fs.readFileSync(csvFile, "utf8");
  const parsedRows = parseCsv(csvContent);
  console.log(`Parsed ${parsedRows.length} rows from CSV.`);

  const { valid, errors, dishes } = validateDishRows(parsedRows);

  if (!valid) {
    console.error(`\nValidation failed with ${errors.length} error(s):`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`Validation PASSED: ${dishes.length} dishes are valid.`);

  if (writeFlag) {
    const dataFilePath = path.resolve(
      process.cwd(),
      "lib",
      "constants",
      "food-menu-data.ts",
    );
    const currentCode = fs.readFileSync(dataFilePath, "utf8");
    const updatedCode = generateTypeScriptCode(currentCode, dishes);
    fs.writeFileSync(dataFilePath, updatedCode, "utf8");
    console.log(`Updated dishes in ${dataFilePath} successfully!`);
  } else {
    console.log(
      `Dry-run mode. Pass --write to apply changes to lib/constants/food-menu-data.ts.`,
    );
  }
}

if (
  process.argv[1] &&
  path.basename(process.argv[1]) === "import-food-menu.mjs"
) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
