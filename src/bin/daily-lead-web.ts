#!/usr/bin/env node

import DailyTipBuilder from '../index';
import { JsonTipLoader } from '../loaders/json-tip-loader';
import RandomTipSelector from '../selectors/random-tip';
import DefaultTipOrchestrator from '../orchestrator/default';
import { HtmlTipFormatter } from '../formatters/html-formatter';
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

collectionFiles.forEach((file) => {
  const collectionName = path.basename(file, '.json');
  const collectionPath = path.join(collectionsDir, file);

  const builder = new DailyTipBuilder<string>();
  const orchestrator = builder
    .withLoader(new JsonTipLoader(collectionPath))
    .withSelector(new RandomTipSelector())
    .withFormatter(new HtmlTipFormatter())
    .withOrchestrator(DefaultTipOrchestrator)
    .build();

  const tip = orchestrator.getTip();

  // Write tip data as a JavaScript file to avoid CORS issues
  const jsContent = `window.tipData_${collectionName.replace(/-/g, '_')} = ${JSON.stringify({ html: tip, timestamp: Date.now() })};`;
  const outputFile = path.join(outputDir, `${collectionName}.js`);
  fs.writeFileSync(outputFile, jsContent);

  console.log(`Tip generated: dist/public/${collectionName}.js`);
});
