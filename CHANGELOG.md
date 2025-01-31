# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-31

### Major Changes
- Adopted formal semantic versioning for better version management
- Stabilized API for production use
- Consolidated all recent changes into first major release

### Added
- Add automatic playwright installation during package setup
- Do not put file ID in file paths when reading for expert context
- Agents log work internally, improving context information
- Clear task list when plan is completed
- Optimize first prompt in chat mode
- Improved prompts
- Chat mode implementation
- Allow agents to be interrupted

## [0.8.2] - 2024-12-23

- Optimize first prompt in chat mode to avoid unnecessary LLM call.

## [0.8.1] - 2024-12-22

- Improved prompts.

## [0.8.0] - 2024-12-22

- Chat mode.
- Allow agents to be interrupted.

## [0.7.1] - 2024-12-20

- Fix model parameters.

## [0.7.0] - 2024-12-20

- Make delete_tasks tool available to planning agent.
- Get rid of implementation args as they are not used.
- Improve ripgrep tool status output.
- Added ask_human tool to allow human operator to answer questions asked by the agent.
- Handle keyboard interrupt (ctrl-c.)
- Disable PAGERs for shell commands so agent can work autonomously.
- Reduce model temperatures to 0.
- Update dependencies.

## [0.6.4] - 2024-12-19

- Added monorepo_detected, existing_project_detected, and ui_detected tools so the agent can take specific actions.
- Prompt improvements for real-world projects.
- Fix env var fallback when base key is given, expert and base provider are different, and expert key is missing.

## [0.6.3] - 2024-12-18

- Fix one shot completion signaling.
- Clean up error outputs.
- Update prompt for better performance on large/monorepo projects.
- Update programmer prompt so we don't use it to delete files.

## [0.6.2] - 2024-12-18
- Allow shell commands to be run in read-only mode.
- When asking for shell command approval, allow cowboy mode to be enabled.
- Update prompt to suggest commands be run in non-interactive mode if possible, e.g. using --no-pager git flag.
- Show tool errors in a panel.

## [0.6.1] - 2024-12-17

### Added
- When key snippets are emitted, snippet files are auto added to related files.
- Add base task to research subtask prompt.
- Adjust research prompt to make sure related files are related to the base task, not just the research subtask.
- Track tasks by ID and allow them to be deleted.
- Make one_shot_completed tool available to research agent.
- Make sure file modification tools are not available when research only flag is used.
- Temporarily disable write file/str replace as they do not work as well as just using the programmer tool.

## [0.6.0] - 2024-12-17

### Added
- New `file_str_replace` tool for performing exact string replacements in files with unique match validation
- New `write_file_tool` for writing content to files with rich output formatting and comprehensive error handling
