package routes

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"

    "github.com/gorilla/mux"
    "github.com/prashanthkunchanapalli/synexiops/inventory-service/db"
    "github.com/prashanthkunchanapalli/synexiops/inventory-service/model"
)

// GET /api/inventory/items
func GetAllInventory(w http.ResponseWriter, r *http.Request) {
    rows, err := db.DB.Query(`SELECT id, name, sku, quantity FROM inventory`)
    if err != nil {
        http.Error(w, "❌ DB error", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var items []model.Inventory
    for rows.Next() {
        var item model.Inventory
        if err := rows.Scan(&item.ID, &item.Name, &item.SKU, &item.Quantity); err != nil {
            http.Error(w, "❌ Row scan error", http.StatusInternalServerError)
            return
        }
        items = append(items, item)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(items)
}

// POST /api/inventory/items
func CreateInventory(w http.ResponseWriter, r *http.Request) {
    var item model.Inventory
    if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
        http.Error(w, "❌ Invalid request payload", http.StatusBadRequest)
        return
    }

    // INSERT + RETURNING id
    query := `INSERT INTO inventory (name, sku, quantity) VALUES ($1, $2, $3) RETURNING id`
    if err := db.DB.QueryRow(query, item.Name, item.SKU, item.Quantity).Scan(&item.ID); err != nil {
        http.Error(w, "❌ Failed to insert item", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(item)
}

// GET /api/inventory/items/{id}
func GetInventoryByID(w http.ResponseWriter, r *http.Request) {
    idStr := mux.Vars(r)["id"]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "❌ Invalid ID", http.StatusBadRequest)
        return
    }

    var item model.Inventory
    query := `SELECT id, name, sku, quantity FROM inventory WHERE id=$1`
    err = db.DB.QueryRow(query, id).Scan(&item.ID, &item.Name, &item.SKU, &item.Quantity)
    if err == sql.ErrNoRows {
        http.Error(w, "❌ Not found", http.StatusNotFound)
        return
    } else if err != nil {
        http.Error(w, "❌ DB error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(item)
}

// PUT /api/inventory/items/{id}
func UpdateInventory(w http.ResponseWriter, r *http.Request) {
    idStr := mux.Vars(r)["id"]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "❌ Invalid ID", http.StatusBadRequest)
        return
    }

    var item model.Inventory
    if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
        http.Error(w, "❌ Invalid input", http.StatusBadRequest)
        return
    }

    query := `UPDATE inventory SET name=$1, sku=$2, quantity=$3 WHERE id=$4`
    if _, err := db.DB.Exec(query, item.Name, item.SKU, item.Quantity, id); err != nil {
        http.Error(w, fmt.Sprintf("❌ Failed to update item: %v", err), http.StatusInternalServerError)
        return
    }

    item.ID = id
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(item)
}

// DELETE /api/inventory/items/{id}
func DeleteInventory(w http.ResponseWriter, r *http.Request) {
    idStr := mux.Vars(r)["id"]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "❌ Invalid ID", http.StatusBadRequest)
        return
    }

    query := `DELETE FROM inventory WHERE id=$1`
    if _, err := db.DB.Exec(query, id); err != nil {
        http.Error(w, fmt.Sprintf("❌ Failed to delete item: %v", err), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}
