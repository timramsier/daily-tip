#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const docsDir = path.join(__dirname, '../docs/development');
const outputDir = path.join(__dirname, '../dist/public/docs/development');

// HTML template with dynamic paths based on depth
const template = (title, content, depth) => {
  const prefix = '../'.repeat(depth);
  const toRoot = depth === 0 ? '' : '../'.repeat(depth);
  // Path to shared-styles.css from development folder
  // depth 0: development/file.html -> ../shared-styles.css
  // depth 1: development/SOLID/file.html -> ../../shared-styles.css
  const sharedStylesPath = `${toRoot}../shared-styles.css`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Daily Tip Documentation</title>
  <link rel="stylesheet" href="${sharedStylesPath}">
</head>
<body>
  <div class="container">
    <div class="nav">
      <a href="${prefix}../index.html">← Back to API Docs</a>
      <a href="${toRoot}README.html">Development Home</a>
      <a href="${toRoot}architecture.html">Architecture</a>
      <a href="${toRoot}SOLID/README.html">SOLID</a>
      <a href="${toRoot}design-patterns/README.html">Design Patterns</a>
    </div>
    ${content}
  </div>
</body>
</html>`;
};

function convertMarkdownFile(filePath, relativePath) {
  const markdown = fs.readFileSync(filePath, 'utf-8');
  
  // Process markdown to fix internal links
  const processedMarkdown = markdown.replace(/\.md\)/g, '.html)');
  
  const html = marked.parse(processedMarkdown);
  const title = path.basename(filePath, '.md');
  
  // Calculate depth (number of subdirectories)
  const depth = (relativePath.match(/\//g) || []).length;
  
  const fullHtml = template(title, html, depth);
  
  const outputPath = path.join(outputDir, relativePath.replace('.md', '.html'));
  const outputDirPath = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, fullHtml);
  console.log(`Converted: ${relativePath} -> ${relativePath.replace('.md', '.html')}`);
}

function processDirectory(dir, baseDir = dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath, baseDir);
    } else if (file.endsWith('.md')) {
      const relativePath = path.relative(baseDir, filePath);
      convertMarkdownFile(filePath, relativePath);
    }
  });
}

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process all markdown files
processDirectory(docsDir);

console.log('Documentation conversion complete!');
