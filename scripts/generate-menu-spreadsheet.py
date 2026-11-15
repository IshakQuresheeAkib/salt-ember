import csv
import os
import openpyxl
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Paths
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
csv_path = os.path.join(base_dir, "scratch", "menu-template.csv")
xlsx_path = os.path.join(base_dir, "scratch", "menu-template.xlsx")

CATEGORIES = [
    ("starters", "Appetizers & Starters", "Pages 2-5"),
    ("soups-noodles", "Soups & Noodles", "Page 6"),
    ("salads", "Salads", "Pages 7-8"),
    ("beef-steaks", "Beef Steaks", "Pages 16-18"),
    ("slow-cooked", "Slow-Cooked Meat", "Page 19"),
    ("main-courses", "Main Courses", "Pages 9-13"),
    ("pasta-spaghetti", "Pasta & Spaghetti", "Pages 22-23"),
    ("pizza", "Pizza", "Page 24"),
    ("thai-chinese", "Thai & Chinese", "Page 25"),
    ("kebabs-naan", "Kebabs & Naan", "Page 21"),
    ("biryani", "Biryani", "Page 15"),
    ("sides", "Side Dishes", "Page 14"),
    ("beverages", "Beverages", "Pages 26-27"),
    ("desserts", "Desserts & Pastry", "Page 27"),
]

wb = openpyxl.Workbook()

# Sheet 1: Menu Items
ws_menu = wb.active
ws_menu.title = "Menu Items"
ws_menu.views.sheetView[0].showGridLines = True

# Sheet 2: Reference
ws_ref = wb.create_sheet(title="Categories_Reference")
ws_ref.views.sheetView[0].showGridLines = True

# Header styles
ref_header_fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
ref_header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")

ws_ref["A1"] = "Category Slug (Used in Menu)"
ws_ref["B1"] = "Display Name"
ws_ref["C1"] = "Menu PDF Page"
for col_char in ["A", "B", "C"]:
    ws_ref[f"{col_char}1"].fill = ref_header_fill
    ws_ref[f"{col_char}1"].font = ref_header_font
    ws_ref[f"{col_char}1"].alignment = Alignment(horizontal="left", vertical="center")

for idx, (cat_slug, cat_name, cat_page) in enumerate(CATEGORIES, start=2):
    ws_ref[f"A{idx}"] = cat_slug
    ws_ref[f"B{idx}"] = cat_name
    ws_ref[f"C{idx}"] = cat_page

ws_ref.column_dimensions["A"].width = 24
ws_ref.column_dimensions["B"].width = 28
ws_ref.column_dimensions["C"].width = 18

# Read CSV rows
with open(csv_path, mode="r", encoding="utf-8") as f:
    reader = csv.reader(f)
    rows = list(reader)

headers = rows[0]
data_rows = rows[1:]

header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
thin_border = Border(
    left=Side(style="thin", color="CBD5E1"),
    right=Side(style="thin", color="CBD5E1"),
    top=Side(style="thin", color="CBD5E1"),
    bottom=Side(style="thin", color="CBD5E1")
)

center_align = Alignment(horizontal="center", vertical="center")
left_align = Alignment(horizontal="left", vertical="center")

# Determine column indices from headers
col_indices = {name: i + 1 for i, name in enumerate(headers)}
cat_col_letter = get_column_letter(col_indices["category"])
popular_col_letter = get_column_letter(col_indices["isPopular"])
spicy_col_letter = get_column_letter(col_indices["isSpicy"])

# Write header row
for col_idx, header_text in enumerate(headers, start=1):
    cell = ws_menu.cell(row=1, column=col_idx, value=header_text)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = center_align
    cell.border = thin_border
ws_menu.row_dimensions[1].height = 28

# Write data rows
for row_idx, row_data in enumerate(data_rows, start=2):
    ws_menu.row_dimensions[row_idx].height = 20
    for col_idx, val in enumerate(row_data, start=1):
        cell = ws_menu.cell(row=row_idx, column=col_idx)
        header_name = headers[col_idx - 1]

        if header_name in ("isPopular", "isSpicy"):
            # Store as real boolean
            val_bool = True if str(val).strip().upper() == "TRUE" else False
            cell.value = val_bool
            cell.alignment = center_align
        else:
            cell.value = val
            if header_name in ("category", "price", "portion"):
                cell.alignment = center_align
            else:
                cell.alignment = left_align

        cell.border = thin_border

max_row = max(len(data_rows) + 150, 300)

# 1. Category Dropdown Data Validation
dv_category = DataValidation(
    type="list",
    formula1=f"=Categories_Reference!$A$2:$A${len(CATEGORIES) + 1}",
    allow_blank=True,
    prompt="Select category from dropdown",
    promptTitle="Category Selection"
)
dv_category.error = "Invalid category slug. Please select from the 14 valid restaurant categories."
dv_category.errorTitle = "Invalid Category"
ws_menu.add_data_validation(dv_category)
dv_category.add(f"{cat_col_letter}2:{cat_col_letter}{max_row}")

# 2. isPopular Dropdown Data Validation
dv_popular = DataValidation(
    type="list",
    formula1='"TRUE,FALSE"',
    allow_blank=True,
    prompt="Select TRUE (starred/popular) or FALSE",
    promptTitle="Popular Dish Badge"
)
ws_menu.add_data_validation(dv_popular)
dv_popular.add(f"{popular_col_letter}2:{popular_col_letter}{max_row}")

# 3. isSpicy Dropdown Data Validation
dv_spicy = DataValidation(
    type="list",
    formula1='"TRUE,FALSE"',
    allow_blank=True,
    prompt="Select TRUE (spicy flame badge) or FALSE",
    promptTitle="Spicy Dish Badge"
)
ws_menu.add_data_validation(dv_spicy)
dv_spicy.add(f"{spicy_col_letter}2:{spicy_col_letter}{max_row}")

# Freeze top row
ws_menu.freeze_panes = "A2"

# Auto-adjust column widths
column_widths = {
    "name": 32,
    "category": 20,
    "price": 16,
    "description": 48,
    "portion": 18,
    "isPopular": 14,
    "isSpicy": 14,
    "imageUrl": 50,
}

for col_name, width in column_widths.items():
    if col_name in col_indices:
        letter = get_column_letter(col_indices[col_name])
        ws_menu.column_dimensions[letter].width = width

wb.save(xlsx_path)
print(f"Successfully generated {xlsx_path} with {len(data_rows)} dishes, category dropdowns, and boolean controls.")
