import { TipFormatter } from '.';
import { Tip } from '../loaders';
import { Marked } from 'marked';

export class HtmlTipFormatter implements TipFormatter<string> {
  private marked: Marked;

  constructor() {
    this.marked = new Marked();
  }

  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    let markdown = '';
    if (categoryTitle) {
      markdown = `<p class="category-title">${categoryTitle}</p>\n\n### ${title}\n\n${tip}`;
    } else {
      markdown = `### ${title}\n\n${tip}`;
    }
    return this.marked.parse(markdown) as string;
  }
}
