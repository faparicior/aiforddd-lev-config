#!/usr/bin/env node

import { execSync } from 'node:child_process';
import os from 'node:os';
import process from 'node:process';
import path from 'node:path';

const RED = '\x1B[31m';
const GREEN = '\x1B[32m';
const NC = '\x1B[0m';

function checkCommand(command) {
	try {
		execSync(command, { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

// Add ~/.local/bin to PATH explicitly, since pipx/uv installs binaries there
process.env.PATH = `${path.join(os.homedir(), '.local', 'bin')}:${process.env.PATH}`;

let hasError = false;

// 1. Verifica binarios (from pseudocode Part A)
if (!checkCommand('nlm --help')) {
	console.log(`[${RED}FAIL${NC}] 'nlm --help' failed. Binary missing or broken.`);
	hasError = true;
} else {
	console.log(`[${GREEN}OK${NC}] 'nlm' binary is working.`);
}

if (!checkCommand('notebooklm-mcp --help')) {
	console.log(`[${RED}FAIL${NC}] 'notebooklm-mcp --help' failed. Binary missing or broken.`);
	hasError = true;
} else {
	console.log(`[${GREEN}OK${NC}] 'notebooklm-mcp' binary is working.`);
}

// 2. Verifica si ya estoy logueado (from pseudocode Part B)
if (!checkCommand('nlm login --check')) {
	console.log(`[${RED}FAIL${NC}] 'nlm login --check' failed. You are not logged in.`);
	hasError = true;
} else {
	console.log(`[${GREEN}OK${NC}] NotebookLM Authentication is successfully verified.`);
}

if (hasError) {
	process.exit(1);
}

process.exit(0);
