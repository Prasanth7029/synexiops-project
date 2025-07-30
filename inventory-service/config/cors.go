package config

import (
  "net/http"
  "github.com/gorilla/handlers"
)

// CORS returns a middleware that allows the specified origins
func CORS(origins []string) func(http.Handler) http.Handler {
  headers := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
  methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
  return handlers.CORS(headers, handlers.AllowedOrigins(origins), methods)
}
