
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Installing RA.Aid dependencies...${NC}"

# Check for ripgrep installation
if ! command -v rg &> /dev/null; then
    echo -e "${YELLOW}ripgrep (rg) is not installed. Installing...${NC}"
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y ripgrep
    elif command -v brew &> /dev/null; then
        brew install ripgrep
    elif command -v yum &> /dev/null; then
        sudo yum install -y ripgrep
    else
        echo -e "${RED}Could not install ripgrep. Please install it manually:${NC}"
        echo -e "Ubuntu/Debian: sudo apt-get install ripgrep"
        echo -e "MacOS: brew install ripgrep"
        echo -e "CentOS/RHEL: sudo yum install ripgrep"
        exit 1
    fi
    echo -e "${GREEN}ripgrep installed successfully${NC}"
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the ra-aid directory
cd "$SCRIPT_DIR"

# Install aider-chat and ra-aid in development mode
pip install aider-chat
pip install -e .

# Change back to original directory
cd - > /dev/null

# Function to check and prompt for environment variables
check_env_var() {
    local var_name=$1
    local description=$2
    
    # Check if variable is already set
    if [ -z "${!var_name}" ]; then
        echo -e "${YELLOW}$var_name is not set${NC}"
        echo -e "$description"
        read -p "Enter your $var_name: " value
        
        # Add to both current session and ~/.bashrc
        export $var_name=$value
        echo "export $var_name=$value" >> ~/.bashrc
        echo -e "${GREEN}$var_name has been set and added to ~/.bashrc${NC}"
    else
        echo -e "${GREEN}$var_name is already set${NC}"
    fi
}

echo -e "\n${GREEN}Checking environment variables...${NC}"

# Check main API keys
check_env_var "ANTHROPIC_API_KEY" "Required for using Anthropic models (default provider)"
check_env_var "OPENAI_API_KEY" "Required for using OpenAI models and expert knowledge queries"

# Optional: Check for OpenRouter
echo -e "\n${YELLOW}Optional: OpenRouter Configuration${NC}"
if [ -z "$OPENROUTER_API_KEY" ]; then
    read -p "Would you like to set up OpenRouter? (y/n) " setup_openrouter
    if [[ $setup_openrouter =~ ^[Yy]$ ]]; then
        check_env_var "OPENROUTER_API_KEY" "Required for using OpenRouter provider"
    fi
else
    echo -e "${GREEN}✓ OPENROUTER_API_KEY is set${NC}"
fi

# Optional: Check for OpenAI-compatible setup
echo -e "\n${YELLOW}Optional: OpenAI-compatible Configuration${NC}"
if [ -z "$OPENAI_API_BASE" ]; then
    read -p "Would you like to set up an OpenAI-compatible provider? (y/n) " setup_compatible
    if [[ $setup_compatible =~ ^[Yy]$ ]]; then
        check_env_var "OPENAI_API_BASE" "Base URL for OpenAI-compatible provider"
    fi
else
    echo -e "${GREEN}✓ OPENAI_API_BASE is set${NC}"
fi

# Optional: Expert-specific configurations
echo -e "\n${YELLOW}Optional: Expert-specific configurations${NC}"
if [ -z "$EXPERT_OPENAI_API_KEY" ] && [ -z "$EXPERT_ANTHROPIC_API_KEY" ]; then
    read -p "Would you like to set up separate expert API keys? (y/n) " setup_expert
    if [[ $setup_expert =~ ^[Yy]$ ]]; then
        check_env_var "EXPERT_OPENAI_API_KEY" "Separate API key for expert knowledge queries (OpenAI)"
        check_env_var "EXPERT_ANTHROPIC_API_KEY" "Separate API key for expert knowledge queries (Anthropic)"
    fi
else
    echo -e "${GREEN}Expert API keys are already configured:${NC}"
    [ ! -z "$EXPERT_OPENAI_API_KEY" ] && echo -e "${GREEN}✓ EXPERT_OPENAI_API_KEY is set${NC}"
    [ ! -z "$EXPERT_ANTHROPIC_API_KEY" ] && echo -e "${GREEN}✓ EXPERT_ANTHROPIC_API_KEY is set${NC}"
fi

# Source the updated bashrc
source ~/.bashrc

echo -e "\n${GREEN}Installation complete!${NC}"
echo -e "You can now use ra-aid. Try: ra-aid --help"
