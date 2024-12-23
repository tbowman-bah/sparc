# RA.Aid Conventions

This document outlines the conventions and usage patterns for the RA.Aid command-line tool, which integrates with the SPARC framework to provide AI-assisted programming and research capabilities.

## SPARC Integration

RA.Aid follows SPARC's staged approach to problem-solving:

1. **Research Stage**: Gathers information and analyzes the task
   - Always runs first
   - Can be limited to research-only using `--research-only`

2. **Planning Stage**: Develops a structured plan for implementation
   - Runs after research if implementation is needed
   - Skipped if `--research-only` is used

3. **Implementation Stage**: Executes the planned changes
   - Runs after planning stage
   - Skipped if `--research-only` is used
   - Uses human-in-the-loop (`--hil`) for safer execution

## Stage Interaction

The SPARC stages work together to provide comprehensive problem-solving:

1. **Research → Planning**
   - Research findings inform the planning process
   - Technical constraints and requirements are carried forward
   - Expert knowledge queries help validate approaches

2. **Planning → Implementation**
   - Plan creates a structured approach for changes
   - Steps are broken down into manageable tasks
   - Dependencies are handled in correct order

3. **Cross-Stage Features**
   - Memory persists across stages for context
   - Expert knowledge available throughout
   - Human-in-the-loop can be used at any stage

## SPARC Best Practices

1. **Research Stage**
   - Use `--research-only` for initial exploration
   - Leverage expert knowledge for domain-specific questions
   - Document findings for future reference

2. **Planning Stage**
   - Review and validate the proposed plan
   - Ensure all dependencies are identified
   - Consider potential impacts on existing code

3. **Implementation Stage**
   - Use `--hil` for critical changes
   - Review each step before approval
   - Keep track of changes for validation

## Command Line Usage

The basic syntax for ra-aid is:
```bash
ra-aid [options] -m "your task message"
```

## Core Options

### Task Specification
- `-m, --message MESSAGE`: Specifies the task or query to be executed by the agent
  - Required unless using chat mode
  - Should be a clear, specific description of the task
  - Example: `ra-aid -m "Add error handling to the database module"`

### Operation Modes

#### Research Mode
- `--research-only`: Limits the agent to performing research without implementation
  - Useful for understanding code or exploring concepts
  - Example: `ra-aid -m "Explain the authentication flow" --research-only`

#### Interactive Modes
- `--hil, -H`: Enables human-in-the-loop mode
  - Allows the agent to prompt for additional information
  - Useful for complex tasks requiring clarification

- `--chat`: Enables direct chat mode with human interaction
  - Implies `--hil`
  - Provides more interactive experience

#### Execution Mode
- `--cowboy-mode`: Skips interactive approval for shell commands
  - Use with caution as it reduces safety checks
  - Best for trusted and well-understood operations

### Model Configuration

#### Primary Model
- `--provider`: Specifies the LLM provider to use
  - Options: `anthropic`, `openai`, `openrouter`, `openai-compatible`
  - Default: Not specified (uses system default)

- `--model`: Specifies the model name
  - Required for non-Anthropic providers
  - Should match the provider's available models

#### Expert Knowledge Model
- `--expert-provider`: Specifies the LLM provider for expert knowledge queries
  - Options: Same as primary provider
  - Default: openai

- `--expert-model`: Specifies the model for expert knowledge queries
  - Required for non-OpenAI providers
  - Should match the expert provider's available models

## Best Practices

1. **Task Description**
   - Be specific and clear in task descriptions
   - Include relevant context in the message
   - Example: `ra-aid -m "Add input validation to user registration function in auth.py"`

2. **Safety First**
   - Avoid `--cowboy-mode` unless necessary
   - Review proposed changes before approval
   - Use `--research-only` when exploring unfamiliar code

3. **Interactive Usage**
   - Use `--hil` when task might need clarification
   - Prefer `--chat` for complex, multi-step tasks
   - Provide clear responses to agent queries

4. **Model Selection**
   - Choose appropriate providers for task type
   - Ensure model compatibility with provider
   - Consider cost and performance tradeoffs

## Examples

1. Basic Task Execution
   ```bash
   ra-aid -m "Add error handling to the database module"
   ```

2. Research-Only Query
   ```bash
   ra-aid -m "Explain the authentication flow" --research-only
   ```

3. Interactive Development
   ```bash
   ra-aid -m "Refactor user authentication" --hil
   ```

4. Custom Model Configuration
   ```bash
   ra-aid -m "Optimize database queries" --provider openai --model gpt-4
   ```

5. Expert Knowledge Query
   ```bash
   ra-aid -m "Analyze security vulnerabilities" --expert-provider anthropic --expert-model claude-2
   ```
