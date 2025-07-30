package db

import (
    "database/sql"
    "fmt"

    "github.com/prashanthkunchanapalli/synexiops/inventory-service/model"
)

// GetAllInventories returns all items
type DBQueries struct{}

func GetAllInventories() ([]model.Inventory, error) {
    rows, err := DB.Query("SELECT id, name, sku, quantity FROM inventory")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var inventories []model.Inventory
    for rows.Next() {
        var inv model.Inventory
        if err := rows.Scan(&inv.ID, &inv.Name, &inv.SKU, &inv.Quantity); err != nil {
            return nil, err
        }
        inventories = append(inventories, inv)
    }
    return inventories, nil
}

// GetInventoryByID returns a single item by its ID
func GetInventoryByID(id int) (*model.Inventory, error) {
    var inv model.Inventory
    query := "SELECT id, name, sku, quantity FROM inventory WHERE id=$1"
    if err := DB.QueryRow(query, id).Scan(&inv.ID, &inv.Name, &inv.SKU, &inv.Quantity); err != nil {
        if err == sql.ErrNoRows {
            return nil, fmt.Errorf("not found")
        }
        return nil, err
    }
    return &inv, nil
}

// CreateInventory inserts a new item and returns its generated ID
func CreateInventory(inv *model.Inventory) error {
    query := `INSERT INTO inventory (name, sku, quantity) VALUES ($1, $2, $3) RETURNING id`
    return DB.QueryRow(query, inv.Name, inv.SKU, inv.Quantity).Scan(&inv.ID)
}

// UpdateInventory updates an existing item by its ID
func UpdateInventory(inv model.Inventory) error {
    query := `UPDATE inventory SET name=$1, sku=$2, quantity=$3 WHERE id=$4`
    res, err := DB.Exec(query, inv.Name, inv.SKU, inv.Quantity, inv.ID)
    if err != nil {
        return err
    }
    count, err := res.RowsAffected()
    if err != nil {
        return err
    }
    if count == 0 {
        return fmt.Errorf("no rows updated")
    }
    return nil
}

// DeleteInventory removes an item by its ID
func DeleteInventory(id int) error {
    query := `DELETE FROM inventory WHERE id=$1`
    res, err := DB.Exec(query, id)
    if err != nil {
        return err
    }
    count, err := res.RowsAffected()
    if err != nil {
        return err
    }
    if count == 0 {
        return fmt.Errorf("no rows deleted")
    }
    return nil
}
