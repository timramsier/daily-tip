import DailyTipBuilder from '../index';
import RandomTipSelector from '../selectors/random-tip';
import DefaultTipOrchestrator from '../orchestrator/default';
import { HtmlTipFormatter } from '../formatters/html-formatter';
import { TipCollection } from '../loaders';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

function displayTip() {
  const urlParams = new URLSearchParams(window.location.search);
  const tipType = urlParams.get('type');
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
  if (!tipType) {
    const links = availableTypes
      .map(
        (type) =>
          `<a href="?type=${type}" style="padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">${collections[type].title}</a>`
      )
      .join('');

    tipContent.innerHTML = `
      <div style="text-align: center;">
        <p style="color: #764ba2; font-size: 18px; margin-bottom: 20px;">
          <strong>Please select a tip type:</strong>
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          ${links}
        </div>
      </div>
    `;
    return;
  }

  // Get the collection
  const collection = collections[tipType];

  if (!collection || !collection.tips || collection.tips.length === 0) {
    const availableLinks = availableTypes
      .map((type) => `<a href="?type=${type}">${type}</a>`)
      .join(', ');
    tipContent.innerHTML = `<p style="color: red;">Tip type '${tipType}' not found. Try: ${availableLinks}</p>`;
    return;
  }

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

  // Use the existing orchestrator to select and format a tip
  const builder = new DailyTipBuilder<string>();
  const orchestrator = builder
    .withLoader(new BrowserTipLoader(collection))
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
