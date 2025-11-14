import { TipFormatter } from '.';
import { Tip } from '../loaders';
import { Marked } from 'marked';

export class HtmlTipFormatter implements TipFormatter<string> {
  private marked: Marked;

  constructor() {
    this.marked = new Marked();
  }

  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    const processedTitle = this.processTitle(title);
    const markdown = this.buildMarkdown(processedTitle, tip, categoryTitle);
    return this.parseMarkdown(markdown);
  }

  private buildMarkdown(title: string, tip: string, categoryTitle?: string): string {
    if (categoryTitle) {
      return this.buildMarkdownWithCategory(title, tip, categoryTitle);
    }
    return this.buildMarkdownWithoutCategory(title, tip);
  }

  private buildMarkdownWithCategory(title: string, tip: string, categoryTitle: string): string {
    const categoryHtml = this.formatCategoryTitle(categoryTitle);
    return `${categoryHtml}\n\n${title}\n\n${tip}`;
  }

  private buildMarkdownWithoutCategory(title: string, tip: string): string {
    return `${title}\n\n${tip}`;
  }

  private formatCategoryTitle(categoryTitle: string): string {
    return `<p class="category-title">${categoryTitle}</p>`;
  }

  private parseMarkdown(markdown: string): string {
    return this.marked.parse(markdown) as string;
  }

  private processTitle(title: string): string {
    const processed = this.styleCollectionName(title);
    return this.wrapInHeading(processed);
  }

  private styleCollectionName(title: string): string {
    // Convert *text* to styled div (for collection names)
    // Match pattern at end of title: space followed by *text*
    return title.replace(/\s\*([^*]+)\*$/g, (_, content) => {
      return ` ${this.createCollectionNameDiv(content)}`;
    });
  }

  private createCollectionNameDiv(content: string): string {
    return `<div style="font-size: 0.7em; color: #999; font-style: italic;">${content}</div>`;
  }

  private wrapInHeading(content: string): string {
    return `### ${content}`;
  }
}
