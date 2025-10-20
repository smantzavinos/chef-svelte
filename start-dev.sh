#!/bin/bash

# Chef Development Startup Script
echo "🍳 Starting Chef Development Environment..."
echo "This will start both the frontend and backend servers"
echo ""

# Check if we're in a Nix environment
if [ -z "$IN_NIX_SHELL" ]; then
    echo "❌ Not in Nix development environment"
    echo "Please run 'nix develop' first, or use direnv"
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down development servers..."
    jobs -p | xargs -r kill
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📦 Starting Convex backend..."
npx convex dev &
CONVEX_PID=$!

# Wait a moment for Convex to start
sleep 3

echo "🌐 Starting Remix frontend..."
pnpm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "   Frontend: http://127.0.0.1:5173"
echo "   Backend:  Convex dev server running"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for any background job to finish
wait