import { TipFormatter } from '.';
import { Tip } from '../loaders';

export class MarkdownTipFormatter implements TipFormatter<string> {
  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    if (categoryTitle) {
      return `## ${categoryTitle}\n\n### ${title}\n\n${tip}`;
    }
    return `### ${title}\n\n${tip}`;
  }
}
