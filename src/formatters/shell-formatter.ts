import { TipFormatter } from '.';
import { Tip } from '../loaders';
import chalk from 'chalk';

/**
 * Formatter that outputs tips with terminal colors and styling using chalk.
 *
 * This formatter produces colorized output suitable for terminal/shell display.
 * It applies ANSI color codes for titles, categories, and markdown formatting
 * including bold, italic, inline code, and bullet lists.
 *
 * Implements the {@link TipFormatter} interface with string output.
 *
 * @example
 * ```typescript
 * const formatter = new ShellTipFormatter();
 * const tip = {
 *   title: 'Use const for immutable values',
 *   tip: 'Always use `const` for values that won\'t change.'
 * };
 * const output = formatter.formatTip(tip);
 * console.log(output); // Displays with colors in terminal
 * ```
 */
export class ShellTipFormatter implements TipFormatter<string> {
  /**
   * Formats a tip with terminal colors and styling.
   *
   * Applies chalk styling to create visually appealing terminal output with
   * horizontal rules, colored titles, and formatted markdown content.
   *
   * @param tip - The tip object containing title and content
   * @param categoryTitle - Optional category title to display above the tip
   * @returns Colorized string ready for terminal display
   */
  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    const formattedTitle = this.formatTitle(title);
    const formattedTip = this.formatMarkdown(tip);
    const horizontalRule = this.createHorizontalRule();

    if (categoryTitle) {
      return this.formatWithCategory(formattedTitle, formattedTip, categoryTitle, horizontalRule);
    }

    return this.formatWithoutCategory(formattedTitle, formattedTip, horizontalRule);
  }

  /**
   * Formats the tip title with bold cyan styling.
   *
   * @param title - Title text to format
   * @returns Styled title string
   * @private
   */
  private formatTitle(title: string): string {
    return chalk.bold.cyan(title);
  }

  /**
   * Formats the category title with bold magenta styling.
   *
   * @param categoryTitle - Category title text to format
   * @returns Styled category title string
   * @private
   */
  private formatCategory(categoryTitle: string): string {
    return chalk.bold.magenta(categoryTitle);
  }

  /**
   * Creates a horizontal rule using gray dashes.
   *
   * @returns 80-character gray horizontal rule
   * @private
   */
  private createHorizontalRule(): string {
    return chalk.gray('─'.repeat(80));
  }

  /**
   * Formats output with category title, tip title, and content.
   *
   * @param title - Formatted tip title
   * @param tip - Formatted tip content
   * @param categoryTitle - Category title to include
   * @param rule - Horizontal rule string
   * @returns Complete formatted string with category
   * @private
   */
  private formatWithCategory(
    title: string,
    tip: string,
    categoryTitle: string,
    rule: string
  ): string {
    const formattedCategory = this.formatCategory(categoryTitle);
    return `${rule}\n${formattedCategory}\n\n${title}\n\n${tip}\n${rule}`;
  }

  /**
   * Formats output with tip title and content only (no category).
   *
   * @param title - Formatted tip title
   * @param tip - Formatted tip content
   * @param rule - Horizontal rule string
   * @returns Complete formatted string without category
   * @private
   */
  private formatWithoutCategory(title: string, tip: string, rule: string): string {
    return `${rule}\n${title}\n\n${tip}\n${rule}`;
  }

  /**
   * Applies markdown formatting to text using chalk styles.
   *
   * Processes bold, italic, inline code, and bullet lists in sequence.
   *
   * @param text - Text with markdown syntax
   * @returns Text with chalk styling applied
   * @private
   */
  private formatMarkdown(text: string): string {
    let formatted = text;
    formatted = this.formatBoldText(formatted);
    formatted = this.formatItalicText(formatted);
    formatted = this.formatInlineCode(formatted);
    formatted = this.formatBulletLists(formatted);
    return formatted;
  }

  /**
   * Converts markdown bold syntax (**text**) to chalk bold styling.
   *
   * @param text - Text potentially containing bold markdown
   * @returns Text with bold styling applied
   * @private
   */
  private formatBoldText(text: string): string {
    return text.replace(/\*\*(.+?)\*\*/g, (_, content) => chalk.bold(content));
  }

  /**
   * Converts markdown italic syntax (*text*) to chalk gray styling.
   *
   * @param text - Text potentially containing italic markdown
   * @returns Text with gray styling applied
   * @private
   */
  private formatItalicText(text: string): string {
    return text.replace(/\*([^*]+?)\*/g, (_, content) => chalk.gray(content));
  }

  /**
   * Converts markdown inline code syntax (`code`) to chalk yellow styling.
   *
   * @param text - Text potentially containing inline code
   * @returns Text with yellow styling applied to code
   * @private
   */
  private formatInlineCode(text: string): string {
    return text.replace(/`(.+?)`/g, (_, content) => chalk.yellow(content));
  }

  /**
   * Converts markdown bullet lists (- or *) to styled bullets with cyan color.
   *
   * @param text - Text potentially containing bullet lists
   * @returns Text with styled bullet points
   * @private
   */
  private formatBulletLists(text: string): string {
    return text.replace(/^[\s]*[-*]\s+(.+)$/gm, (_, content) => {
      return `  ${chalk.cyan('•')} ${content}`;
    });
  }
}
