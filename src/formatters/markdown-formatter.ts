import { TipFormatter } from '.';
import { Tip } from '../loaders';

/**
 * Formatter that outputs tips in pure markdown format.
 *
 * This formatter produces clean markdown output with proper heading hierarchy.
 * Category titles use level 2 headings (##), tip titles use level 3 headings (###),
 * and tip content is preserved as-is.
 *
 * Implements the {@link TipFormatter} interface with string output.
 *
 * @example
 * ```typescript
 * const formatter = new MarkdownTipFormatter();
 * const tip = {
 *   title: 'Use const for immutable values',
 *   tip: 'Always use `const` for values that won\'t change.'
 * };
 * const markdown = formatter.formatTip(tip);
 * // Returns: "### Use const for immutable values\n\nAlways use `const`..."
 * ```
 *
 * @example
 * ```typescript
 * // With category title
 * const markdown = formatter.formatTip(tip, 'JavaScript Best Practices');
 * // Returns: "## JavaScript Best Practices\n\n### Use const...\n\n..."
 * ```
 */
export class MarkdownTipFormatter implements TipFormatter<string> {
  /**
   * Formats a tip as markdown with optional category title.
   *
   * Produces properly structured markdown with heading hierarchy:
   * - Category title: Level 2 heading (##)
   * - Tip title: Level 3 heading (###)
   * - Tip content: Preserved as-is
   *
   * @param tip - The tip object containing title and content
   * @param categoryTitle - Optional category title to display above the tip
   * @returns Markdown formatted string
   */
  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    if (categoryTitle) {
      return this.formatWithCategory(title, tip, categoryTitle);
    }
    return this.formatWithoutCategory(title, tip);
  }

  /**
   * Formats output with category title, tip title, and content.
   *
   * @param title - Tip title
   * @param tip - Tip content
   * @param categoryTitle - Category title to display
   * @returns Markdown string with category (##), title (###), and content
   * @private
   */
  private formatWithCategory(title: string, tip: string, categoryTitle: string): string {
    return `## ${categoryTitle}\n\n### ${title}\n\n${tip}`;
  }

  /**
   * Formats output with tip title and content only (no category).
   *
   * @param title - Tip title
   * @param tip - Tip content
   * @returns Markdown string with title (###) and content
   * @private
   */
  private formatWithoutCategory(title: string, tip: string): string {
    return `### ${title}\n\n${tip}`;
  }
}
