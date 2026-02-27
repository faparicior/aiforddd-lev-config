# NotebookLM MCP Installation Pseudocode (Generic)

This document describes the unified installation logic for the NotebookLM Model Context Protocol (MCP) tool across different Unix-like environments (Linux and macOS).

## Logic Flow

### PART A — Preparation (Terminal inside Antigravity)

1. **Open an integrated terminal.**

2. **Check if uvx exists:**
   - Run: `uvx --version`
   - If it fails, install `uv` or use `pipx` (choose what works):
     - **macOS** (if you have Homebrew): `brew install uv`
     - **Universal alternative**: `python3 -m pip install --user pipx && python3 -m pipx ensurepath`

3. **Install the unified package (preferred):**
   - If you have `uv`: `uv tool install notebooklm-mcp-cli`
   - If you have `pipx`: `pipx install notebooklm-mcp-cli`
   - If it was already installed, upgrade:
     - `uv tool upgrade notebooklm-mcp-cli` (or `pipx upgrade notebooklm-mcp-cli`)


4. **Verify binaries:**
   - Run: `nlm --help`
   - Run: `notebooklm-mcp --help`

### PART B — NotebookLM Authentication (mandatory)

5. **Verify if already logged in:**
   - Run: `nlm login --check`

6. **If NOT logged in, authenticate:**
   - Run: `nlm login`
   - Chrome will open with a dedicated profile; complete the login in Google/NotebookLM and return to Antigravity.

## Uninstallation Logic Flow

1. **Uninstallation Initiation**
   - The user selects "Uninstall" in the CLI.

2. **Automatic NotebookLM Logout**
   - Check if `nlm` command is available.
   - Execute `nlm logout` automatically.

3. **Tool Removal**
   - Execute `uv tool uninstall notebooklm-mcp-cli` (or the equivalent `pipx` uninstall command).
   - Verify removal from PATH.

4. **Verification of Removal**
   - Verify tools are no longer in PATH.
   - Display success message.

5. **Completion & User Guidance**
   - Provide visual confirmation of successful uninstallation.
   - Display note about shell restart if PATH changes don't take effect immediately.

6. **Uninstallation Scripts**
   - **Linux**: `recipes/mcp-notebooklm/linux/uninstall.js`
   - **macOS**: `recipes/mcp-notebooklm/macos/uninstall.sh`
   - _Script Features_:
     - Color-coded output for user feedback.
     - Graceful error handling with fallback instructions.
     - Verification steps after each major operation.
