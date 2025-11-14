import { TipFormatter } from '.';
import { Tip } from '../loaders';
import chalk from 'chalk';

export class ShellTipFormatter implements TipFormatter<string> {
  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    const formattedTitle = this.formatTitle(title);
    const formattedTip = this.formatMarkdown(tip);
    const horizontalRule = this.createHorizontalRule();

    if (categoryTitle) {
      return this.formatWithCategory(formattedTitle, formattedTip, categoryTitle, horizontalRule);
    }

    return this.formatWithoutCategory(formattedTitle, formattedTip, horizontalRule);
  }

  private formatTitle(title: string): string {
    return chalk.bold.cyan(title);
  }

  private formatCategory(categoryTitle: string): string {
    return chalk.bold.magenta(categoryTitle);
  }

  private createHorizontalRule(): string {
    return chalk.gray('─'.repeat(80));
  }

  private formatWithCategory(
    title: string,
    tip: string,
    categoryTitle: string,
    rule: string
  ): string {
    const formattedCategory = this.formatCategory(categoryTitle);
    return `${rule}\n${formattedCategory}\n\n${title}\n\n${tip}\n${rule}`;
  }

  private formatWithoutCategory(title: string, tip: string, rule: string): string {
    return `${rule}\n${title}\n\n${tip}\n${rule}`;
  }

  private formatMarkdown(text: string): string {
    let formatted = text;
    formatted = this.formatBoldText(formatted);
    formatted = this.formatItalicText(formatted);
    formatted = this.formatInlineCode(formatted);
    formatted = this.formatBulletLists(formatted);
    return formatted;
  }

  private formatBoldText(text: string): string {
    return text.replace(/\*\*(.+?)\*\*/g, (_, content) => chalk.bold(content));
  }

  private formatItalicText(text: string): string {
    return text.replace(/\*([^*]+?)\*/g, (_, content) => chalk.gray(content));
  }

  private formatInlineCode(text: string): string {
    return text.replace(/`(.+?)`/g, (_, content) => chalk.yellow(content));
  }

  private formatBulletLists(text: string): string {
    return text.replace(/^[\s]*[-*]\s+(.+)$/gm, (_, content) => {
      return `  ${chalk.cyan('•')} ${content}`;
    });
  }
}
