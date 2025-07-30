package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/prashanthkunchanapalli/synexiops/inventory-service/db"
	"github.com/prashanthkunchanapalli/synexiops/inventory-service/routes"
)

func main() {
	// Initialize the database
	dbConfig := db.Config{
		Host:     "localhost",
		Port:     "5432",
		User:     "postgres",
		Password: "@Srinani7029",
		DBName:   "inventorydb",
	}
	db.InitDB(dbConfig)

	// Set up router
	router := routes.SetupRouter()

	// CORS settings: allow your Vite dev server at localhost:5173
	allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
	allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:5173"})
	allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})

	// Wrap router with CORS middleware
	corsRouter := handlers.CORS(allowedHeaders, allowedOrigins, allowedMethods)(router)

	fmt.Println("🚀 Inventory service running at http://localhost:8082")
	log.Fatal(http.ListenAndServe(":8082", corsRouter))
}
