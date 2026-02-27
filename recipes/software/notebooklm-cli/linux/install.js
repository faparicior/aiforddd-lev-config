#!/usr/bin/env node

import { execSync } from 'node:child_process';
import os from 'node:os';
import process from 'node:process';
import path from 'node:path';

const RED = '\x1B[31m';
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

function runCommand(command, errorMessage) {
	try {
		execSync(command, { stdio: 'inherit' });
		return true;
	} catch (error) {
		if (errorMessage) {
			log(RED, errorMessage);
			console.error(error.message);
		}
		return false;
	}
}

log(BLUE, `Starting installation of NotebookLM CLI...`);

// 1. Check if uvx exists
let installer = null;
if (isCommandPresent('uvx')) {
	log(GREEN, 'uvx is present. Using uv.');
	installer = 'uv';
} else {
	log(YELLOW, 'uvx not found. Attempting universal alternative (pipx)...');
	if (runCommand('python3 -m pip install --user pipx && python3 -m pipx ensurepath', 'Failed to install pipx.')) {
		installer = 'pipx';
		// Add local bin to PATH for the current process
		const localBinPath = path.join(os.homedir(), '.local', 'bin');
		process.env.PATH = `${localBinPath}:${process.env.PATH}`;
	} else {
		log(RED, 'Could not establish an installer (uv or pipx).');
		process.exit(1);
	}
}

// 2. Install unified package
log(BLUE, 'Installing notebooklm-mcp-cli...');
if (installer === 'uv') {
	const installed = isCommandPresent('notebooklm-mcp');
	const installCmd = installed ? 'uv tool upgrade notebooklm-mcp-cli' : 'uv tool install notebooklm-mcp-cli --force';
	if (!runCommand(installCmd, 'Failed to install notebooklm-mcp-cli via uv.')) {
		process.exit(1);
	}
} else if (installer === 'pipx') {
	const installed = isCommandPresent('notebooklm-mcp');
	const installCmd = installed ? 'pipx upgrade notebooklm-mcp-cli' : 'pipx install notebooklm-mcp-cli';
	if (!runCommand(installCmd, 'Failed to install notebooklm-mcp-cli via pipx.')) {
		process.exit(1);
	}
}

// Ensure ~/.local/bin is in PATH just in case
const localBinPath = path.join(os.homedir(), '.local', 'bin');
process.env.PATH = `${localBinPath}:${process.env.PATH}`;

// 3. Verify binaries
if (isCommandPresent('nlm') && isCommandPresent('notebooklm-mcp')) {
	log(GREEN, 'Binaries (nlm, notebooklm-mcp) verified successfully.');
} else {
	log(RED, 'Verification failed. Please ensure ~/.local/bin is in your PATH.');
	process.exit(1);
}

// 4. Authentication NotebookLM
log(BLUE, 'Checking NotebookLM login status...');
try {
	execSync('nlm login --check', { stdio: 'ignore' });
	log(GREEN, 'Already logged in to NotebookLM.');
} catch {
	log(YELLOW, 'Not logged in. Initiating login...');
	if (!runCommand('nlm login', 'Failed to login to NotebookLM.')) {
		process.exit(1);
	}
}

log(GREEN, '\nSetup complete!');
