#!/usr/bin/env node
/**
 * SSG Build Script: Compile and run Java snippets, capture outputs.
 *
 * Scans java-snippets/*.java, runs javac + java for each,
 * writes generated/snippet-outputs.json with stdout/stderr/exitCode.
 *
 * Naming convention:
 *   File: java-snippets/snippet-hello-world.java
 *   Class inside: Must match filename converted to PascalCase
 *   e.g., snippet-hello-world.java → class SnippetHelloWorld
 *
 * Usage: node scripts/generate-snippet-outputs.mjs
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { join, basename, parse as parsePath } from 'node:path';
import { existsSync } from 'node:fs';
import { promisify } from 'node:util';

const exec = promisify(execFile);

const SNIPPETS_DIR = join(import.meta.dirname, '..', 'java-snippets');
const OUTPUT_FILE = join(import.meta.dirname, '..', 'generated', 'snippet-outputs.json');
const TIMEOUT_MS = 10000;

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

async function runJavaSnippet(filePath) {
  const fileName = parsePath(filePath).name; // e.g., "snippet-hello-world"
  const className = toPascalCase(fileName);
  const dir = parsePath(filePath).dir;

  const result = {
    compiles: false,
    stdout: '',
    stderr: '',
    exitCode: 1,
  };

  // Step 1: Compile
  try {
    const { stderr } = await exec('javac', [filePath], {
      timeout: TIMEOUT_MS,
      cwd: dir,
    });
    result.compiles = true;
    if (stderr) result.stderr = stderr;
  } catch (err) {
    result.stderr = err.stderr || err.message;
    result.exitCode = err.code || 1;
    return result;
  }

  // Step 2: Execute
  try {
    const { stdout, stderr } = await exec('java', ['-cp', dir, className], {
      timeout: TIMEOUT_MS,
      cwd: dir,
    });
    result.stdout = stdout;
    if (stderr) result.stderr += stderr;
    result.exitCode = 0;
  } catch (err) {
    result.stdout = err.stdout || '';
    result.stderr += (err.stderr || err.message);
    result.exitCode = err.code || 1;
  }

  return result;
}

async function main() {
  // Ensure directories exist
  await mkdir(join(import.meta.dirname, '..', 'generated'), { recursive: true });

  if (!existsSync(SNIPPETS_DIR)) {
    console.log('No java-snippets/ directory found. Writing empty outputs.');
    await writeFile(OUTPUT_FILE, JSON.stringify({}, null, 2));
    return;
  }

  const files = (await readdir(SNIPPETS_DIR))
    .filter(f => f.endsWith('.java'))
    .sort();

  if (files.length === 0) {
    console.log('No .java files found in java-snippets/. Writing empty outputs.');
    await writeFile(OUTPUT_FILE, JSON.stringify({}, null, 2));
    return;
  }

  console.log(`Found ${files.length} Java snippet(s). Compiling and running...`);

  const outputs = {};

  for (const file of files) {
    const filePath = join(SNIPPETS_DIR, file);
    const snippetId = parsePath(file).name; // "snippet-hello-world"
    process.stdout.write(`  ${snippetId} ... `);

    try {
      outputs[snippetId] = await runJavaSnippet(filePath);
      const status = outputs[snippetId].compiles
        ? (outputs[snippetId].exitCode === 0 ? '✓' : '✗ runtime error')
        : '✗ compile error';
      console.log(status);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      outputs[snippetId] = {
        compiles: false,
        stdout: '',
        stderr: err.message,
        exitCode: 1,
      };
    }
  }

  await writeFile(OUTPUT_FILE, JSON.stringify(outputs, null, 2));
  console.log(`\nWrote ${Object.keys(outputs).length} snippet output(s) to generated/snippet-outputs.json`);
}

main().catch(err => {
  console.error('Build script failed:', err);
  process.exit(1);
});
