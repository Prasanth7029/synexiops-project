package controllers

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

// GetAllInventory handles GET /api/inventory/items
func GetAllInventory(w http.ResponseWriter, r *http.Request) {
    items, err := db.GetAllInventories()
    if err != nil {
        http.Error(w, "❌ Failed to fetch inventory", http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(items)
}

// CreateInventory handles POST /api/inventory/items
func CreateInventory(w http.ResponseWriter, r *http.Request) {
    var inv model.Inventory
    if err := json.NewDecoder(r.Body).Decode(&inv); err != nil {
        http.Error(w, "❌ Invalid input", http.StatusBadRequest)
        return
    }

    if err := db.CreateInventory(&inv); err != nil {
        http.Error(w, "❌ Failed to insert inventory", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(inv)
}

// GetInventoryByID handles GET /api/inventory/items/{id}
func GetInventoryByID(w http.ResponseWriter, r *http.Request) {
    idStr := mux.Vars(r)["id"]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "❌ Invalid ID", http.StatusBadRequest)
        return
    }

    inv, err := db.GetInventoryByID(id)
    if err != nil {
        if err == sql.ErrNoRows || err.Error() == "not found" {
            http.Error(w, "❌ Item not found", http.StatusNotFound)
        } else {
            http.Error(w, "❌ Failed to fetch item", http.StatusInternalServerError)
        }
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(inv)
}

// UpdateInventory handles PUT /api/inventory/items/{id}
func UpdateInventory(w http.ResponseWriter, r *http.Request) {
    idStr := mux.Vars(r)["id"]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "❌ Invalid ID", http.StatusBadRequest)
        return
    }

    var inv model.Inventory
    if err := json.NewDecoder(r.Body).Decode(&inv); err != nil {
        http.Error(w, "❌ Invalid input", http.StatusBadRequest)
        return
    }

    inv.ID = id
    if err := db.UpdateInventory(inv); err != nil {
        if err.Error() == "no rows updated" {
            http.Error(w, "❌ Item not found", http.StatusNotFound)
        } else {
            http.Error(w, fmt.Sprintf("❌ Failed to update item: %v", err), http.StatusInternalServerError)
        }
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(inv)
}

// DeleteInventory handles DELETE /api/inventory/items/{id}
func DeleteInventory(w http.ResponseWriter, r *http.Request) {
    idStr := mux.Vars(r)["id"]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "❌ Invalid ID", http.StatusBadRequest)
        return
    }

    if err := db.DeleteInventory(id); err != nil {
        if err.Error() == "no rows deleted" {
            http.Error(w, "❌ Item not found", http.StatusNotFound)
        } else {
            http.Error(w, fmt.Sprintf("❌ Failed to delete item: %v", err), http.StatusInternalServerError)
        }
        return
    }

    w.WriteHeader(http.StatusNoContent)
}