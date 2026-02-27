#!/usr/bin/env node

import { execSync } from 'node:child_process';

const GREEN = '\x1B[32m';
const BLUE = '\x1B[34m';
const YELLOW = '\x1B[33m';
const NC = '\x1B[0m';

function log(color, message) {
	console.log(`${color}${message}${NC}`);
}

function isCommandPresent(command) {
	try {
		execSync(`command -v ${command}`, { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

log(BLUE, 'Starting uninstallation of NotebookLM CLI for macOS...');

// 1. Automatic NotebookLM Logout
if (isCommandPresent('nlm')) {
	log(BLUE, 'Attempting to log out from NotebookLM...');
	try {
		execSync('nlm logout', { stdio: 'ignore' });
		log(GREEN, 'Logged out successfully.');
	} catch {
		log(YELLOW, 'Warning: Could not log out from NotebookLM.');
	}
}

// 2. Tool Removal
log(BLUE, 'Uninstalling notebooklm-mcp-cli...');
if (isCommandPresent('uv')) {
	try {
		execSync('uv tool uninstall notebooklm-mcp-cli', { stdio: 'inherit' });
		log(GREEN, 'notebooklm-mcp-cli uninstalled successfully via uv.');
	} catch {
		log(YELLOW, 'Warning: Could not uninstall via uv.');
	}
} else if (isCommandPresent('pipx')) {
	try {
		execSync('pipx uninstall notebooklm-mcp-cli', { stdio: 'inherit' });
		log(GREEN, 'notebooklm-mcp-cli uninstalled successfully via pipx.');
	} catch {
		log(YELLOW, 'Warning: Could not uninstall via pipx.');
	}
} else {
	log(YELLOW, 'No installer (uv/pipx) found to uninstall the tool.');
}

// 3. Verification of Removal
if (!isCommandPresent('nlm') && !isCommandPresent('notebooklm-mcp')) {
	log(GREEN, 'NotebookLM MCP tools have been removed from PATH.');
} else {
	log(YELLOW, 'Warning: Some NotebookLM MCP commands are still available in PATH. You may need to restart your shell.');
}

log(GREEN, 'Uninstallation complete!');
