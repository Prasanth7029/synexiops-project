package routes

import (
    "net/http"

    "github.com/gorilla/mux"
    "github.com/prashanthkunchanapalli/synexiops/inventory-service/controllers"
)

// SetupRouter configures the API routes for inventory CRUD
func SetupRouter() *mux.Router {
    router := mux.NewRouter()

    // Health & root
    router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("🏠 Welcome to Inventory Service!"))
    }).Methods("GET")
    router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("✅ Inventory service is healthy"))
    }).Methods("GET")

    // CRUD routes
    router.HandleFunc("/api/inventory/items", controllers.GetAllInventory).Methods("GET")
    router.HandleFunc("/api/inventory/items", controllers.CreateInventory).Methods("POST")
    router.HandleFunc("/api/inventory/items/{id}", controllers.GetInventoryByID).Methods("GET")
    router.HandleFunc("/api/inventory/items/{id}", controllers.UpdateInventory).Methods("PUT")
    router.HandleFunc("/api/inventory/items/{id}", controllers.DeleteInventory).Methods("DELETE")

    return router
}
