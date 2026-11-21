#!/usr/bin/env node
/**
 * scripts/quality-runner.mjs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runQualityFromCfg as installedRunQualityFromCfg } from '@terra-symposium/hygiene/cli';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packagePath = relative(root, resolve(process.cwd()));
if (packagePath.startsWith('..' + sep) || packagePath === '..') throw new Error(`Quality must run inside ${root}`);
const repoPackage = packagePath === '' || packagePath === 'config';
const baseConfig = [join(root, 'quality.json'), join(root, 'config/quality.json')].find(existsSync);
if (!baseConfig) throw new Error(`Missing quality.json in ${root}`);
const args = process.argv.slice(2).filter(arg => arg !== '--');

if (process.env.QUALITY_RUNNER_SCOPE_ONLY === '1') {
	console.log(JSON.stringify({ root, package: packagePath || '.', scope: repoPackage ? 'repository' : 'package', config: baseConfig, args }));
	process.exit(0);
}

const raw = JSON.parse(readFileSync(baseConfig, 'utf8'));
raw.root = root;
raw.configRoot = existsSync(join(root, 'config')) ? join(root, 'config') : root;
const genLinks = [];
const scan = [root];
const pruned = new Set(['.git', 'node_modules', 'dist', 'target', '.venv', 'vendor']);
while (scan.length) {
	const dir = scan.pop();
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isSymbolicLink()) {
			if (raw.extensions?.some(ext => entry.name.endsWith(ext)) && statSync(path, { throwIfNoEntry: false })?.isDirectory()) genLinks.push(relative(root, path));
		} else if (entry.isDirectory() && !pruned.has(entry.name)) scan.push(path);
	}
}
raw.skippedFiles = [...new Set([...(raw.skippedFiles ?? []), ...genLinks])];
/**
 * Keeps build and test commands outside the source-hygiene pass so they run in their own gates.
 * @param entry Configured quality command with a name and arguments.
 * @return Whether the command belongs to the build or test gate.
 */
const isBuildOrTest = entry =>
	/(^|[^a-z])(build|test)([^a-z]|$)/.test(String(entry.name ?? '').toLowerCase()) || (entry.args ?? []).map(String).some(arg => /^(?:test(?::.*)?|build(?::.*)?|docs:build)$/.test(arg));
raw.qualityCommands = (raw.qualityCommands ?? []).filter(entry => !isBuildOrTest(entry));
if (!repoPackage) {
	raw.sourceRoots = [packagePath];
	raw.includeRoots = [];
	raw.lintRoots = [packagePath];
	raw.typecheckRoots = [];
	delete raw.typecheckCommand;
	raw.qualityCommands = [];
	raw.recommendationCommands = [];
	raw.enabledChecks = {
		...raw.enabledChecks,
		type: false,
		knip: false,
		diff: false,
		github: false,
		command: false,
		'documented-commands': false,
	};
}
const cacheRoot = join(root, 'dist/cache/quality-runner');
mkdirSync(cacheRoot, { recursive: true });
const tempDir = mkdtempSync(join(cacheRoot, 'run-'));
const configPath = join(tempDir, 'quality.json');
writeFileSync(configPath, JSON.stringify(raw));
try {
	if (args[0] === 'quality' && !args.includes('--warn') && !args.includes('--fix') && !args.includes('--safe-fix')) args.push('--fix');
	await (process.env.STANDARDS_QUALITY_RUNNER ? (await import(pathToFileURL(process.env.STANDARDS_QUALITY_RUNNER).href)).runQualityFromCfg : installedRunQualityFromCfg)(configPath, args);
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
