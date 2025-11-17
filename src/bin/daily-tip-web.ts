#!/usr/bin/env node

/**
 * Build script that bundles tip collections into a browser-compatible JavaScript file.
 *
 * This script reads all JSON collection files from the collections directory and
 * combines them into a single JavaScript file (tip-data.js) that can be loaded
 * in the browser. The collections are exposed via window.tipCollections.
 *
 * Output: dist/public/tip-data.js
 */

import path from 'node:path';
import fs from 'node:fs';

const collectionsDir = path.resolve(__dirname, '../../collections');
const outputDir = path.resolve(__dirname, '../../dist/public');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find all JSON files in the collections directory
const collectionFiles = fs.readdirSync(collectionsDir).filter((file) => file.endsWith('.json'));

if (collectionFiles.length === 0) {
  console.log('No collection files found in collections/');
  process.exit(0);
}

// Bundle all collections into a single JavaScript file
const collections: Record<string, unknown> = {};

collectionFiles.forEach((file) => {
  const collectionName = path.basename(file, '.json');
  const collectionPath = path.join(collectionsDir, file);
  const collectionData = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'));
  collections[collectionName] = collectionData;
});

// Write collections data as a JavaScript file
const jsContent = `window.tipCollections = ${JSON.stringify(collections, null, 2)};`;
const outputFile = path.join(outputDir, 'tip-data.js');
fs.writeFileSync(outputFile, jsContent);

console.log(`Collections bundled: dist/public/tip-data.js`);
