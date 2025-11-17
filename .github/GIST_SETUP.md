# GitHub Gist Publishing Setup

This workflow automatically builds the package and publishes the `dist/public/` HTML files to a GitHub Gist for easy viewing.

## Setup Instructions

### 1. Create a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Gist Publisher"
4. Select the `gist` scope
5. Click "Generate token"
6. Copy the token (you won't see it again!)

### 2. Add the Token as a Repository Secret

1. Go to your repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GIST_TOKEN`
4. Value: Paste your personal access token
5. Click "Add secret"

### 3. Automatic Gist Management

The workflow automatically finds and updates a gist named "daily-tip". On the first run, it creates a new gist with this name. On subsequent runs, it finds and updates the same gist automatically - no need to configure a `GIST_ID` secret!

## Usage

The workflow runs automatically on:
- Push to `main` branch
- Manual trigger via Actions tab

After a successful run, check the workflow output for:
- **Gist URL**: Direct link to the gist
- **Preview URL**: HTML preview using htmlpreview.github.io

## Files Published

The workflow publishes all files from `dist/public/` including:
- `index.html`
- `app.js`
- `tip-data.js`
- All files in `docs/` subdirectory

Note: Since GitHub Gists don't support directory structures, nested files are flattened with paths converted to filenames (e.g., `docs/index.html` becomes `docs-index.html`).
