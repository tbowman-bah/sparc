# SPARC CLI Architecture

## System Overview

```
+----------------+     +-------------+     +--------------+
|  CLI Interface |---->| Core Engine |---->| Tool System  |
+----------------+     +-------------+     +--------------+
        |                    |                   |
        v                    v                   v
+----------------+     +-------------+     +--------------+
|  Config System |     | LLM Clients |     | File System  |
+----------------+     +-------------+     +--------------+
```

## Core Components

### CLI Interface
- Command parsing
- Option handling
- Output formatting
- Interactive prompts

### Core Engine
- Task coordination
- Mode selection
- Provider management
- Memory management

### Tool System
- Shell command execution
- File operations
- Expert knowledge queries
- Human interaction

## Key Modules

### LLM Integration (llm.py)
- Provider initialization
- Model configuration
- API communication
- Error handling

### Tool Configuration (tool_configs.py)
- Tool registration
- Permission management
- Mode-specific toolsets
- Tool chain composition

### Memory System (tools/memory.py)
- State management
- Context tracking
- Key facts storage
- Work logging

### Shell Interface (tools/shell.py)
- Command execution
- Output capture
- Safety controls
- Cowboy mode

## Integration Points

### External Systems
- LLM Provider APIs
- File System
- Shell Environment
- Version Control

### Internal Components
- Tool <-> Memory
- LLM <-> Tools
- Config <-> Engine
- Shell <-> Safety Controls

## Workflow

```
[User Input] -> [CLI] -> [Config] -> [Engine]
                                       |
[Output] <- [Console] <- [Tools] <- [LLM]
```

1. User provides task description
2. CLI processes command options
3. Config system initializes environment
4. Engine coordinates execution
5. Tools perform operations
6. Results stream to console

For usage instructions, see the [Usage Guide](usage.md).
