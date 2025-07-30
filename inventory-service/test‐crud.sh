#!/usr/bin/env bash
set -euo pipefail
BASE="http://localhost:8082/api/inventory/items"
echo "→ 1) LIST current items"
curl -sS "$BASE" | jq
echo
echo "→ 2) CREATE a new item"
CREATE_RESP=$(curl -sS -X POST "$BASE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Scripted 01Gadget","sku":"SG-99109","quantity":42}')
echo "$CREATE_RESP" | jq
NEW_ID=$(echo "$CREATE_RESP" | jq -r '.id')
echo "  → New item has ID = $NEW_ID"
echo
echo "→ 3) GET that item by ID"
curl -sS "$BASE/$NEW_ID" | jq
echo
echo "→ 4) UPDATE its quantity to 100"
curl -sS -X PUT "$BASE/$NEW_ID" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Scripted 01Gadget\",\"sku\":\"SG-99109\",\"quantity\":100}" \
  | jq
echo
echo "→ 5) DELETE the item"
curl -sS -X DELETE "$BASE/$NEW_ID" -w "\nSTATUS: %{http_code}\n"
echo
echo "→ 6) VERIFY it’s gone"
curl -sS "$BASE/$NEW_ID" -w "\nSTATUS: %{http_code}\n"
echo
echo "✅ All CRUD operations tested!"
