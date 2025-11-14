import { TipFormatter } from '.';
import { Tip } from '../loaders';
import { Marked } from 'marked';

export class HtmlTipFormatter implements TipFormatter<string> {
  private marked: Marked;

  constructor() {
    this.marked = new Marked();
  }

  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    // Process title to style italic text (collection names)
    const processedTitle = this.processTitle(title);

    let markdown = '';
    if (categoryTitle) {
      markdown = `<p class="category-title">${categoryTitle}</p>\n\n${processedTitle}\n\n${tip}`;
    } else {
      markdown = `${processedTitle}\n\n${tip}`;
    }
    return this.marked.parse(markdown) as string;
  }

  private processTitle(title: string): string {
    // Convert *text* to styled div (for collection names)
    // Match pattern at end of title: space followed by *text*
    const processed = title.replace(/\s\*([^*]+)\*$/g, (_, content) => {
      return ` <div style="font-size: 0.7em; color: #999; font-style: italic;">${content}</div>`;
    });

    return `### ${processed}`;
  }
}
