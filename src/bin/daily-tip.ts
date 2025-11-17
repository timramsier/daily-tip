#!/usr/bin/env node

import DailyTipBuilder from '../index';
import { JsonTipLoader } from '../loaders/json-tip-loader';
import { CompositeTipLoader } from '../loaders/composite-loader';
import RandomTipSelector from '../selectors/random-tip';
import DefaultTipOrchestrator from '../orchestrator/default';
import { ShellTipFormatter } from '../formatters/shell-formatter';
import path from 'node:path';
import fs from 'node:fs';

const collectionsDir = path.resolve(__dirname, '../../collections');

/**
 * Retrieves the list of available tip collections from the collections directory.
 *
 * Scans the collections directory for JSON files and returns their base names
 * without the .json extension.
 *
 * @returns Array of collection names (e.g., ['leadership-tone', 'productivity-hacks'])
 */
function getAvailableCollections(): string[] {
  return fs
    .readdirSync(collectionsDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.basename(file, '.json'));
}

/**
 * Displays help information including usage, available collections, and examples.
 *
 * Prints to console the command syntax, list of available collections,
 * and example usage patterns.
 */
function showHelp() {
  const collections = getAvailableCollections();
  console.log('Usage: daily-tip <collection-type> [collection-type...]');
  console.log('');
  console.log('Available collections:');
  collections.forEach((name) => console.log(`  - ${name}`));
  console.log('');
  console.log('Examples:');
  console.log('  daily-tip leadership-tone');
  console.log('  daily-tip productivity-hacks');
  console.log('  daily-tip leadership-tone productivity-hacks');
}

// Get tip types from command line arguments
const tipTypes = process.argv.slice(2);

// Show help if no argument or help flag
if (tipTypes.length === 0 || tipTypes.includes('--help') || tipTypes.includes('-h')) {
  showHelp();
  process.exit(tipTypes.length === 0 ? 1 : 0);
}

// Validate all collections exist
const invalidCollections = tipTypes.filter((type) => {
  const collectionPath = path.resolve(collectionsDir, `${type}.json`);
  return !fs.existsSync(collectionPath);
});

if (invalidCollections.length > 0) {
  console.error(`Error: Collection(s) not found: ${invalidCollections.join(', ')}\n`);
  showHelp();
  process.exit(1);
}

// Create loaders for each collection
const loaders = tipTypes.map((type) => {
  const collectionPath = path.resolve(collectionsDir, `${type}.json`);
  return new JsonTipLoader(collectionPath);
});

// Use composite loader if multiple collections, otherwise use single loader
const loader = loaders.length > 1 ? new CompositeTipLoader(loaders) : loaders[0];

const builder = new DailyTipBuilder<string>();
const orchestrator = builder
  .withLoader(loader)
  .withSelector(new RandomTipSelector())
  .withFormatter(new ShellTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();

const tip = orchestrator.getTip();
console.log(tip);
