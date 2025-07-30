#!/bin/bash

# Colors
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Starting SynexiOps Services...${NC}"

# Start PostgreSQL (assumes it's installed locally via Homebrew or system service)
echo -e "${GREEN}🚀 Starting PostgreSQL...${NC}"
pg_ctl -D /usr/local/var/postgres start 2>/dev/null || echo "Postgres might already be running"

# --- AUTH SERVICE ---
echo -e "${GREEN}🛡️  Starting auth-service...${NC}"
cd auth-service
./mvnw spring-boot:run &
AUTH_PID=$!
cd ..

# --- INVENTORY SERVICE ---
echo -e "${GREEN}📦 Starting inventory-service...${NC}"
cd inventory-service
go run main.go &
INVENTORY_PID=$!
cd ..

# --- FRONTEND ---
echo -e "${GREEN}🌐 Starting frontend (Vite)...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait option
echo -e "${GREEN}✅ All services started.${NC}"
echo -e "🔗 auth-service:     http://localhost:8081"
echo -e "🔗 inventory-service: http://localhost:8082"
echo -e "🔗 frontend:         http://localhost:5173"
echo -e "\nPress Ctrl+C to stop all services."

# Trap to kill all background processes
trap "kill $AUTH_PID $INVENTORY_PID $FRONTEND_PID; exit 0" SIGINT

# Keep script running
wait
