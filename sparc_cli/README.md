# SPARC CLI

Version: 0.8.2

SPARC CLI is a powerful command-line tool for executing programming and research tasks using AI assistance.

## Features

- Research and implementation capabilities
- Multiple LLM provider support (Anthropic, OpenAI, OpenRouter)
- Interactive chat mode
- Human-in-the-loop interaction
- Expert knowledge queries
- Shell command execution with "cowboy mode"
- Rich console output formatting

## Installation

```bash
pip install sparc-cli
```

Requires Python 3.8 or higher.

## Usage

Basic command structure:
```bash
sparc -m "Your task description" [options]
```

### Options

- `-m, --message`: The task or query to execute (required)
- `--research-only`: Only perform research without implementation
- `--provider`: LLM provider to use (anthropic|openai|openrouter|openai-compatible)
- `--model`: Model name to use (required for non-Anthropic providers)
- `--cowboy-mode`: Skip interactive approval for shell commands
- `--expert-provider`: Provider for expert knowledge queries
- `--expert-model`: Model for expert queries
- `--hil, -H`: Enable human-in-the-loop mode
- `--chat`: Enable interactive chat mode

### Examples

```bash
# Standard task execution
sparc -m "Add error handling to the database module"

# Research-only query
sparc -m "Explain the authentication flow" --research-only

# Interactive chat mode
sparc --chat

# Using specific provider/model
sparc -m "Optimize database queries" --provider openai --model gpt-4
```

## Acknowledgments

Originally developed by the ra-aid team. Extended and maintained by the SPARC Framework community.
