#!/bin/bash

# Define colors for output
PINK='\033[0;35m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${PINK}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PINK}  ❤️  Push The Bar Higher - Dev Launcher  ❤️${NC}"
echo -e "${PINK}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Store the root directory
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Function to kill child processes on exit
cleanup() {
    echo -e "\n${PINK}Stopping services and freeing ports...${NC}"
    # Kill the entire process group
    kill -- -$$ 2>/dev/null
    # Also explicitly kill by PID in case
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${PINK}All services stopped. Goodbye! 💤${NC}"
    exit 0
}

# Trap Ctrl+C (SIGINT) and SIGTERM
trap cleanup SIGINT SIGTERM

# 1. Start Backend
echo -e "\n${CYAN}[1/2] Launching Backend on port 4000...${NC}"
cd "$ROOT_DIR/backend"
npm run dev &
BACKEND_PID=$!

# 2. Start Frontend
echo -e "${CYAN}[2/2] Launching Frontend on port 3000...${NC}"
cd "$ROOT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo -e "\n${PINK}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PINK}  Frontend → http://localhost:3000${NC}"
echo -e "${PINK}  Backend  → http://localhost:4000${NC}"
echo -e "${PINK}  Press Ctrl+C to stop both services.${NC}"
echo -e "${PINK}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
