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
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Daily Tip Documentation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
    }
    h1, h2, h3, h4 { color: #667eea; margin-top: 1.5em; }
    h1 { border-bottom: 2px solid #667eea; padding-bottom: 0.3em; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    a { color: #667eea; text-decoration: none; }
    a:hover { text-decoration: underline; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #667eea; color: white; }
    .nav { margin-bottom: 2em; padding: 1em; background: #f8f8f8; border-radius: 8px; }
    .nav a { margin-right: 1em; display: inline-block; margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <div class="nav">
    <a href="${prefix}../index.html">← Back to API Docs</a>
    <a href="${toRoot}README.html">Development Home</a>
    <a href="${toRoot}architecture.html">Architecture</a>
    <a href="${toRoot}SOLID/README.html">SOLID</a>
    <a href="${toRoot}design-patterns/README.html">Design Patterns</a>
  </div>
  ${content}
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
