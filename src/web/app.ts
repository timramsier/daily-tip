import DailyTipBuilder from '../index';
import RandomTipSelector from '../selectors/random-tip';
import DefaultTipOrchestrator from '../orchestrator/default';
import { HtmlTipFormatter } from '../formatters/html-formatter';
import { TipCollection } from '../loaders';
import { CompositeTipLoader } from '../loaders/composite-loader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

// Create a simple loader that returns the collection data
class BrowserTipLoader {
  constructor(private collection: TipCollection) {}
  getTips() {
    return this.collection.tips;
  }
  getCollectionTitle() {
    return this.collection.title;
  }
}

function displayTip() {
  const urlParams = new URLSearchParams(window.location.search);
  const tipTypeParam = urlParams.get('type');
  const tipContent = document.getElementById('tip-content');

  if (!tipContent) return;

  // Check if collections are loaded
  if (!win.tipCollections) {
    tipContent.innerHTML = '<p style="color: red;">Failed to load tip collections.</p>';
    return;
  }

  const collections = win.tipCollections as Record<string, TipCollection>;
  const availableTypes = Object.keys(collections);

  // Check if type parameter is provided
  if (!tipTypeParam) {
    const singleLinks = availableTypes
      .map(
        (type) =>
          `<a href="?type=${type}" style="padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">${collections[type].title}</a>`
      )
      .join('');

    const allLink = `<a href="?type=${availableTypes.join(',')}" style="padding: 12px 24px; background: #764ba2; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">All Collections</a>`;

    tipContent.innerHTML = `
      <div style="text-align: center;">
        <p style="color: #764ba2; font-size: 18px; margin-bottom: 20px;">
          <strong>Please select a tip type:</strong>
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          ${singleLinks}
          ${allLink}
        </div>
      </div>
    `;
    return;
  }

  // Parse comma-separated types
  const tipTypes = tipTypeParam.split(',').map((t) => t.trim());

  // Validate all requested collections exist
  const invalidTypes = tipTypes.filter((type) => !collections[type]);
  if (invalidTypes.length > 0) {
    const availableLinks = availableTypes
      .map((type) => `<a href="?type=${type}">${type}</a>`)
      .join(', ');
    tipContent.innerHTML = `<p style="color: red;">Tip type(s) not found: ${invalidTypes.join(', ')}. Try: ${availableLinks}</p>`;
    return;
  }

  // Create loaders for each requested collection
  const loaders = tipTypes.map((type) => new BrowserTipLoader(collections[type]));

  // Use composite loader if multiple collections, otherwise use single loader
  const loader = loaders.length > 1 ? new CompositeTipLoader(loaders) : loaders[0];

  // Use the existing orchestrator to select and format a tip
  const builder = new DailyTipBuilder<string>();
  const orchestrator = builder
    .withLoader(loader)
    .withSelector(new RandomTipSelector())
    .withFormatter(new HtmlTipFormatter())
    .withOrchestrator(DefaultTipOrchestrator)
    .build();

  const tip = orchestrator.getTip();
  tipContent.innerHTML = tip;
}

// Wait for tip-data.js to load, then display tip
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', displayTip);
} else {
  displayTip();
}
