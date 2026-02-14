/**
 * SSG Data Loader — provides access to pre-compiled Java snippet outputs.
 *
 * At build time, generate-snippet-outputs.mjs runs javac + java for all
 * snippets and writes generated/snippet-outputs.json.
 *
 * This module loads that JSON and exposes typed accessors.
 */

export interface SnippetOutput {
  compiles: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}

// Import the generated JSON (baked into the JS bundle at build time)
let snippetOutputs: Record<string, SnippetOutput> = {};

try {
  // Dynamic import to handle case where file doesn't exist yet
  snippetOutputs = require('../generated/snippet-outputs.json');
} catch {
  // No generated outputs yet — will be empty until first build
  snippetOutputs = {};
}

export function getSnippetOutput(snippetId: string): SnippetOutput | null {
  return snippetOutputs[snippetId] ?? null;
}

export function getExpectedOutput(snippetId: string): string {
  const output = getSnippetOutput(snippetId);
  return output?.compiles ? (output.stdout || '') : '';
}

export function getExpectedError(snippetId: string): string {
  const output = getSnippetOutput(snippetId);
  return !output?.compiles ? (output?.stderr || '') : '';
}

export function getAllSnippetIds(): string[] {
  return Object.keys(snippetOutputs);
}
