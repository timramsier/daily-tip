import { TipFormatter } from '.';
import { Tip } from '../loaders';
import chalk from 'chalk';

export class ShellTipFormatter implements TipFormatter<string> {
  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    const formattedTitle = chalk.bold.cyan(title);
    const formattedTip = this.formatMarkdown(tip);
    const horizontalRule = chalk.gray('─'.repeat(80));

    if (categoryTitle) {
      const formattedCategory = chalk.bold.magenta(categoryTitle);
      return `${horizontalRule}\n${formattedCategory}\n\n${formattedTitle}\n\n${formattedTip}\n${horizontalRule}`;
    }

    return `${horizontalRule}\n${formattedTitle}\n\n${formattedTip}\n${horizontalRule}`;
  }

  private formatMarkdown(text: string): string {
    // Handle bold text **text** first (before italics)
    text = text.replace(/\*\*(.+?)\*\*/g, (_, content) => chalk.bold(content));

    // Handle italic/quoted text *"quoted"* or *text* - use lighter gray
    text = text.replace(/\*([^*]+?)\*/g, (_, content) => chalk.gray(content));

    // Handle inline code `code`
    text = text.replace(/`(.+?)`/g, (_, content) => chalk.yellow(content));

    // Handle bullet lists - convert to styled bullets (do this last to preserve formatting)
    text = text.replace(/^[\s]*[-*]\s+(.+)$/gm, (_, content) => {
      return `  ${chalk.cyan('•')} ${content}`;
    });

    return text;
  }
}
