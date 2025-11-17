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

### 3. (Optional) Pin to a Specific Gist

After the first run, the workflow will create a new gist. If you want subsequent runs to update the same gist instead of creating new ones:

1. Check the workflow run output for the Gist ID
2. Go to repository Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `GIST_ID`
5. Value: The gist ID from the workflow output
6. Click "Add secret"

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
