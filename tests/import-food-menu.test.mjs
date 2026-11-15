import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import path from "node:path";
import {
  parseCsv,
  parseSpreadsheet,
  validateDishRows,
  generateTypeScriptCode,
  generateDishSlug,
  parseAndFormatPrice,
} from "../scripts/import-food-menu.mjs";

test("generateDishSlug generates clean kebab-case slugs from dish names", () => {
  const seen = new Set();
  const slug1 = generateDishSlug("Tomahawk Steak [500g]", "beef-steaks", seen);
  assert.equal(slug1, "tomahawk-steak-500g");
  seen.add(slug1);

  const slug2 = generateDishSlug("Prawn Sticks (6 pcs)", "starters", seen);
  assert.equal(slug2, "prawn-sticks-6-pcs");
  seen.add(slug2);

  // Name collision should use category prefix
  const slugBarbecue1 = generateDishSlug("Barbecue Chicken", "starters", seen);
  assert.equal(slugBarbecue1, "barbecue-chicken");
  seen.add(slugBarbecue1);

  const slugBarbecue2 = generateDishSlug("Barbecue Chicken", "main-courses", seen);
  assert.equal(slugBarbecue2, "main-courses-barbecue-chicken");
  seen.add(slugBarbecue2);
});

test("parseAndFormatPrice accepts numbers and dual numeric prices, rejecting non-numeric", () => {
  const p1 = parseAndFormatPrice("550");
  assert.equal(p1.valid, true);
  assert.equal(p1.formattedPrice, "550 TK");

  const p2 = parseAndFormatPrice("850 / 1000");
  assert.equal(p2.valid, true);
  assert.equal(p2.formattedPrice, "850 / 1000 TK");

  const pWithTk = parseAndFormatPrice("450 TK");
  assert.equal(pWithTk.valid, true);
  assert.equal(pWithTk.formattedPrice, "450 TK");

  const pInvalid = parseAndFormatPrice("free");
  assert.equal(pInvalid.valid, false);
  assert.match(pInvalid.error, /Only numbers are accepted/);
});

test("parseCsv correctly parses quoted fields and commas without id column", () => {
  const csv = [
    "name,category,price,description,portion,isPopular,isSpicy,imageUrl",
    '"Wings, BBQ Special",starters,"550","Glazed with spicy, tangy sauce",6 pcs,TRUE,TRUE,https://res.cloudinary.com/demo/image/upload/v1/wings.jpg',
  ].join("\n");

  const rows = parseCsv(csv);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, undefined);
  assert.equal(rows[0].name, "Wings, BBQ Special");
  assert.equal(rows[0].category, "starters");
  assert.equal(rows[0].price, "550");
  assert.equal(rows[0].description, "Glazed with spicy, tangy sauce");
  assert.equal(rows[0].portion, "6 pcs");
  assert.equal(rows[0].isPopular, "TRUE");
  assert.equal(rows[0].isSpicy, "TRUE");
  assert.equal(rows[0].imageUrl, "https://res.cloudinary.com/demo/image/upload/v1/wings.jpg");
});

test("validateDishRows auto-generates id from name and formats pure numeric price", () => {
  const rows = [
    {
      name: "Tomahawk Steak [500g]",
      category: "beef-steaks",
      price: "2590",
      description: "Great steak",
      portion: "500g",
    },
    {
      name: "Mexican Hot Pizza",
      category: "pizza",
      price: "850 / 1000",
      // description omitted to test optional description
    },
  ];

  const { valid, errors, dishes } = validateDishRows(rows);
  assert.equal(valid, true, `Validation failed with errors: ${errors.join(", ")}`);
  assert.equal(dishes[0].id, "tomahawk-steak-500g");
  assert.equal(dishes[0].price, "2590 TK");
  assert.equal(dishes[0].description, "Great steak");

  assert.equal(dishes[1].id, "mexican-hot-pizza");
  assert.equal(dishes[1].price, "850 / 1000 TK");
  assert.equal(dishes[1].description, undefined);
});

test("validateDishRows rejects invalid category slugs", () => {
  const invalidRows = [
    {
      name: "Test Dish",
      category: "invalid-cat",
      price: "500",
      description: "Tasty dish",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/dish.jpg",
    },
  ];
  const { valid, errors } = validateDishRows(invalidRows);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes("invalid-cat")));
});

test("validateDishRows rejects duplicate dish IDs if explicit", () => {
  const duplicateRows = [
    {
      id: "dish-1",
      name: "Dish One",
      category: "starters",
      price: "100",
      description: "Desc",
    },
    {
      id: "dish-1",
      name: "Dish One Duplicate",
      category: "starters",
      price: "100",
      description: "Desc",
    },
  ];
  const { valid, errors } = validateDishRows(duplicateRows);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes("Duplicate dish id")));
});

test("validateDishRows accepts compliant dish rows and parses booleans", () => {
  const validRows = [
    {
      name: "Garlic Mushrooms",
      category: "starters",
      price: "450",
      description: "Sauteed button mushrooms",
      portion: "1:2",
      isPopular: "true",
      isSpicy: "false",
      imageUrl: "https://res.cloudinary.com/salt-ember/image/upload/v1/dish.jpg",
    },
  ];
  const { valid, errors, dishes } = validateDishRows(validRows);
  assert.equal(valid, true);
  assert.equal(errors.length, 0);
  assert.equal(dishes[0].id, "garlic-mushrooms");
  assert.equal(dishes[0].price, "450 TK");
  assert.equal(dishes[0].isPopular, true);
  assert.equal(dishes[0].isSpicy, undefined);
  assert.equal(dishes[0].image, "https://res.cloudinary.com/salt-ember/image/upload/v1/dish.jpg");
});

test("generateTypeScriptCode preserves file structure and generates valid FoodItem array", () => {
  const sampleDishes = [
    {
      id: "test-item",
      name: "Test Item",
      category: "starters",
      price: "350 TK",
      description: "Sample description",
      portion: "1:1",
      isPopular: true,
      isSpicy: false,
      image: "https://res.cloudinary.com/demo/sample.webp",
    },
    {
      id: "no-desc-item",
      name: "No Desc Item",
      category: "starters",
      price: "200 TK",
    },
  ];

  const existingSource = `export interface FoodItem {}
export interface FoodCategory {}
export const FOOD_CATEGORIES = [];
export const FOOD_DISHES: FoodItem[] = [
  { id: "old-item" }
];
`;

  const updatedSource = generateTypeScriptCode(existingSource, sampleDishes);
  assert.match(updatedSource, /id:\s*"test-item"/);
  assert.match(updatedSource, /id:\s*"no-desc-item"/);
  assert.doesNotMatch(updatedSource, /id:\s*"old-item"/);
  assert.match(updatedSource, /export const FOOD_CATEGORIES/);
});

test("parseSpreadsheet loads both .csv and .xlsx spreadsheets correctly", () => {
  const tmpCsv = path.resolve(process.cwd(), "scratch", "temp-test.csv");
  fs.writeFileSync(
    tmpCsv,
    "name,category,price,description,portion,isPopular,isSpicy,imageUrl\nTest Dish,starters,550,Desc,1 serving,TRUE,FALSE,https://example.com/img.png\n",
    "utf8",
  );

  const csvRows = parseSpreadsheet(tmpCsv);
  assert.equal(csvRows.length, 1, "CSV must contain 1 dish");
  assert.equal(csvRows[0].name, "Test Dish");
  fs.unlinkSync(tmpCsv);

  const xlsxFile = path.resolve(process.cwd(), "scratch", "menu-template.xlsx");
  if (fs.existsSync(xlsxFile)) {
    const xlsxRows = parseSpreadsheet(xlsxFile);
    assert.equal(xlsxRows.length, 136, "XLSX must contain 136 dishes");
    assert.equal(xlsxRows[0].name, "Barbecue Chicken");
    assert.equal(xlsxRows[0].category, "starters");
    assert.equal(xlsxRows[0].isPopular, "TRUE");
    assert.equal(xlsxRows[0].isSpicy, "FALSE");
  }
});
