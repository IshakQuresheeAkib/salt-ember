import json
import sys
import openpyxl

def read_xlsx(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb["Menu Items"] if "Menu Items" in wb.sheetnames else wb.active
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []
    
    headers = [str(h or "").strip() for h in rows[0]]
    data = []
    for r in rows[1:]:
        if not any(r):
            continue
        item = {}
        for i, h in enumerate(headers):
            val = r[i] if i < len(r) else ""
            if val is None:
                val = ""
            elif isinstance(val, bool):
                val = "TRUE" if val else "FALSE"
            else:
                val = str(val).strip()
            item[h] = val
        data.append(item)
    return data

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python read-xlsx.py <file.xlsx>", file=sys.stderr)
        sys.exit(1)
    items = read_xlsx(sys.argv[1])
    print(json.dumps(items))
