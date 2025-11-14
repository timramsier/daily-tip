#!/usr/bin/env node

import DailyTipBuilder from '../index';
import { JsonTipLoader } from '../loaders/json-tip-loader';
import RandomTipSelector from '../selectors/random-tip';
import DefaultTipOrchestrator from '../orchestrator/default';
import { ShellTipFormatter } from '../formatters/shell-formatter';
import path from 'node:path';
import fs from 'node:fs';

const collectionsDir = path.resolve(__dirname, '../../collections');

function getAvailableCollections(): string[] {
  return fs
    .readdirSync(collectionsDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.basename(file, '.json'));
}

function showHelp() {
  const collections = getAvailableCollections();
  console.log('Usage: daily-tip <collection-type>');
  console.log('');
  console.log('Available collections:');
  collections.forEach((name) => console.log(`  - ${name}`));
  console.log('');
  console.log('Examples:');
  console.log('  daily-tip leadership-tone');
  console.log('  daily-tip productivity-hacks');
}

// Get tip type from command line argument
const tipType = process.argv[2];

// Show help if no argument or help flag
if (!tipType || tipType === '--help' || tipType === '-h') {
  showHelp();
  process.exit(tipType ? 0 : 1);
}

const collectionPath = path.resolve(collectionsDir, `${tipType}.json`);

// Check if collection exists
if (!fs.existsSync(collectionPath)) {
  console.error(`Error: Collection '${tipType}' not found.\n`);
  showHelp();
  process.exit(1);
}

const builder = new DailyTipBuilder<string>();
const orchestrator = builder
  .withLoader(new JsonTipLoader(collectionPath))
  .withSelector(new RandomTipSelector())
  .withFormatter(new ShellTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();

const tip = orchestrator.getTip();
console.log(tip);
