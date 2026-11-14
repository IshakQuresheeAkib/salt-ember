import assert from "node:assert/strict";
import test from "node:test";
import { parseCsv, validateDishRows, generateTypeScriptCode } from "../scripts/import-food-menu.mjs";

test("parseCsv correctly parses quoted fields and commas", () => {
  const csv = [
    "id,name,category,price,description,portion,isPopular,isSpicy,imageUrl",
    'starter-wings,"Wings, BBQ Special",starters,"550 TK","Glazed with spicy, tangy sauce",6 pcs,TRUE,TRUE,https://res.cloudinary.com/demo/image/upload/v1/wings.jpg',
  ].join("\n");

  const rows = parseCsv(csv);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, "starter-wings");
  assert.equal(rows[0].name, "Wings, BBQ Special");
  assert.equal(rows[0].category, "starters");
  assert.equal(rows[0].price, "550 TK");
  assert.equal(rows[0].description, "Glazed with spicy, tangy sauce");
  assert.equal(rows[0].portion, "6 pcs");
  assert.equal(rows[0].isPopular, "TRUE");
  assert.equal(rows[0].isSpicy, "TRUE");
  assert.equal(rows[0].imageUrl, "https://res.cloudinary.com/demo/image/upload/v1/wings.jpg");
});

test("validateDishRows rejects invalid category slugs", () => {
  const invalidRows = [
    {
      id: "test-dish",
      name: "Test Dish",
      category: "invalid-cat",
      price: "500 TK",
      description: "Tasty dish",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/dish.jpg",
    },
  ];
  const { valid, errors } = validateDishRows(invalidRows);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes("invalid-cat")));
});

test("validateDishRows rejects duplicate dish IDs", () => {
  const duplicateRows = [
    {
      id: "dish-1",
      name: "Dish One",
      category: "starters",
      price: "100 TK",
      description: "Desc",
    },
    {
      id: "dish-1",
      name: "Dish One Duplicate",
      category: "starters",
      price: "100 TK",
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
      id: "garlic-mushrooms",
      name: "Garlic Mushrooms",
      category: "starters",
      price: "450 TK",
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
  assert.doesNotMatch(updatedSource, /id:\s*"old-item"/);
  assert.match(updatedSource, /export const FOOD_CATEGORIES/);
});
