import { TipFormatter } from '.';
import { Tip } from '../loaders';
import { Marked } from 'marked';

/**
 * Formatter that converts tips to HTML format using markdown parsing.
 *
 * This formatter processes tips through markdown to HTML conversion using the
 * Marked library. It supports category titles, collection names, and full
 * markdown syntax including bold, italic, code blocks, and lists.
 *
 * Implements the {@link TipFormatter} interface with string output.
 *
 * @example
 * ```typescript
 * const formatter = new HtmlTipFormatter();
 * const tip = {
 *   title: 'Use const for immutable values',
 *   tip: 'Always use `const` for values that won\'t change.'
 * };
 * const html = formatter.formatTip(tip);
 * // Returns: <h3>Use const for immutable values</h3><p>Always use <code>const</code>...</p>
 * ```
 *
 * @example
 * ```typescript
 * // With category title
 * const html = formatter.formatTip(tip, 'JavaScript Best Practices');
 * // Includes category as styled paragraph before content
 * ```
 */
export class HtmlTipFormatter implements TipFormatter<string> {
  /** Marked instance for markdown to HTML conversion */
  private marked: Marked;

  /**
   * Creates a new HTML formatter with a configured Marked instance.
   */
  constructor() {
    this.marked = new Marked();
  }

  /**
   * Formats a tip as HTML with optional category title.
   *
   * Processes the tip through markdown parsing, handling special formatting
   * for collection names (text in asterisks at end of title) and category titles.
   *
   * @param tip - The tip object containing title and content
   * @param categoryTitle - Optional category title to display above the tip
   * @returns HTML string with formatted tip content
   */
  formatTip({ title, tip }: Tip, categoryTitle?: string): string {
    const processedTitle = this.processTitle(title);
    const markdown = this.buildMarkdown(processedTitle, tip, categoryTitle);
    return this.parseMarkdown(markdown);
  }

  /**
   * Builds the complete markdown string with or without category.
   *
   * @param title - Processed title string
   * @param tip - Tip content
   * @param categoryTitle - Optional category title
   * @returns Complete markdown string ready for parsing
   * @private
   */
  private buildMarkdown(title: string, tip: string, categoryTitle?: string): string {
    if (categoryTitle) {
      return this.buildMarkdownWithCategory(title, tip, categoryTitle);
    }
    return this.buildMarkdownWithoutCategory(title, tip);
  }

  /**
   * Builds markdown with category title included.
   *
   * @param title - Processed title string
   * @param tip - Tip content
   * @param categoryTitle - Category title to include
   * @returns Markdown string with category HTML and content
   * @private
   */
  private buildMarkdownWithCategory(title: string, tip: string, categoryTitle: string): string {
    const categoryHtml = this.formatCategoryTitle(categoryTitle);
    return `${categoryHtml}\n\n${title}\n\n${tip}`;
  }

  /**
   * Builds markdown without category title.
   *
   * @param title - Processed title string
   * @param tip - Tip content
   * @returns Markdown string with title and content only
   * @private
   */
  private buildMarkdownWithoutCategory(title: string, tip: string): string {
    return `${title}\n\n${tip}`;
  }

  /**
   * Formats the category title as a styled HTML paragraph.
   *
   * @param categoryTitle - Category title text
   * @returns HTML paragraph element with category-title class
   * @private
   */
  private formatCategoryTitle(categoryTitle: string): string {
    return `<p class="category-title">${categoryTitle}</p>`;
  }

  /**
   * Parses markdown string to HTML using Marked library.
   *
   * @param markdown - Markdown formatted string
   * @returns HTML string
   * @private
   */
  private parseMarkdown(markdown: string): string {
    return this.marked.parse(markdown) as string;
  }

  /**
   * Processes the title by styling collection names and wrapping in heading.
   *
   * @param title - Raw title string
   * @returns Processed title with collection name styling and heading wrapper
   * @private
   */
  private processTitle(title: string): string {
    const processed = this.styleCollectionName(title);
    return this.wrapInHeading(processed);
  }

  /**
   * Converts collection names (text in asterisks at end of title) to styled divs.
   *
   * Matches pattern: space followed by *text* at the end of the title.
   * Example: "My Tip *Collection Name*" becomes "My Tip <div>Collection Name</div>"
   *
   * @param title - Title string potentially containing collection name
   * @returns Title with collection name converted to styled div
   * @private
   */
  private styleCollectionName(title: string): string {
    // Convert *text* to styled div (for collection names)
    // Match pattern at end of title: space followed by *text*
    return title.replace(/\s\*([^*]+)\*$/g, (_, content) => {
      return ` ${this.createCollectionNameDiv(content)}`;
    });
  }

  /**
   * Creates a styled div element for collection name display.
   *
   * @param content - Collection name text
   * @returns HTML div with inline styling for collection name
   * @private
   */
  private createCollectionNameDiv(content: string): string {
    return `<div style="font-size: 0.7em; color: #999; font-style: italic;">${content}</div>`;
  }

  /**
   * Wraps content in a level 3 heading (###).
   *
   * @param content - Content to wrap in heading
   * @returns Markdown heading string
   * @private
   */
  private wrapInHeading(content: string): string {
    return `### ${content}`;
  }
}
