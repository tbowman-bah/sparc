#!/bin/bash

set -e  # Exit on error

# Setup flyctl environment
export FLYCTL_INSTALL="/home/$USER/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Verify flyctl is available
if ! command -v flyctl &> /dev/null; then
    echo "Error: flyctl not found. Please run ./install.sh first"
    exit 1
fi

echo "Accessing SPARC CLI on Fly.io..."
echo "================================"

# Check if config exists
if [ ! -f "$(dirname "$0")/config.sh" ]; then
    echo "Error: config.sh not found. Please run install.sh first."
    exit 1
fi

# Source configuration
source "$(dirname "$0")/config.sh"

# Check if app exists
if ! flyctl apps list | grep -q "^$FLY_APP_NAME"; then
    echo "Error: Application $FLY_APP_NAME not found"
    echo "Please run install.sh and deploy.sh first"
    exit 1
fi

# Function to run SPARC CLI command
run_sparc() {
    local mode=$1
    
    echo "Connecting to SPARC CLI..."
    echo "Note: Use Ctrl+C to exit"
    echo
    flyctl ssh console --app "$FLY_APP_NAME" --command "sparc-startup $mode"
}

# Provide options for access
echo
echo "Access Options:"
echo "1) Start SPARC CLI in Chat Mode"
echo "2) Start SPARC CLI in Research Mode"
echo "3) Start SPARC CLI in Cowboy Mode (no command confirmations)"
echo "4) Connect to Console (manual mode)"
echo "5) View Logs"
echo "6) Exit"
echo

read -p "Choose an option [1-6]: " choice

case $choice in
    1)
        echo "Starting SPARC CLI in Chat Mode..."
        run_sparc "chat"
        ;;
    2)
        echo "Starting SPARC CLI in Research Mode..."
        run_sparc "research"
        ;;
    3)
        echo "Starting SPARC CLI in Cowboy Mode..."
        run_sparc "cowboy"
        ;;
    4)
        echo "Connecting to console..."
        echo "You can run SPARC CLI manually with:"
        echo "  sparc-startup [mode]"
        echo
        echo "Available modes:"
        echo "  chat     : Start in chat mode"
        echo "  research : Start in research mode"
        echo "  cowboy   : Start in cowboy mode"
        echo
        echo "For help, run: sparc-startup --help"
        echo
        flyctl ssh console --app "$FLY_APP_NAME"
        ;;
    5)
        echo "Showing logs..."
        flyctl logs --app "$FLY_APP_NAME"
        ;;
    6)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac
