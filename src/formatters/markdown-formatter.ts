import { TipFormatter } from '.';
import { Tip } from '../loaders';

export class MarkdownTipFormatter implements TipFormatter<string> {
  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    if (categoryTitle) {
      return this.formatWithCategory(title, tip, categoryTitle);
    }
    return this.formatWithoutCategory(title, tip);
  }

  private formatWithCategory(title: string, tip: string, categoryTitle: string): string {
    return `## ${categoryTitle}\n\n### ${title}\n\n${tip}`;
  }

  private formatWithoutCategory(title: string, tip: string): string {
    return `### ${title}\n\n${tip}`;
  }
}
