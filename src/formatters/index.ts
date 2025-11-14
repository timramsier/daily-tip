import { Tip } from '../loaders';
import { PoisonTipFormatter } from './poison-formatter';
import { MarkdownTipFormatter } from './markdown-formatter';
import { ShellTipFormatter } from './shell-formatter';
import { HtmlTipFormatter } from './html-formatter';

/**
 * Interface for formatting tips into various output formats.
 *
 * Formatters are responsible for converting tip data into the desired output
 * format such as HTML, Markdown, terminal-styled text, or any custom format.
 * They handle presentation logic including styling, layout, and markup.
 *
 * @typeParam T - The output type of the formatter (e.g., string, Buffer, custom object)
 *
 * @see {@link HtmlTipFormatter} for HTML output
 * @see {@link MarkdownTipFormatter} for Markdown output
 * @see {@link ShellTipFormatter} for terminal-styled output
 *
 * @example
 * ```typescript
 * // Create a custom formatter
 * class JsonTipFormatter implements TipFormatter<object> {
 *   formatTip(tip: Tip, categoryTitle?: string): object {
 *     return {
 *       category: categoryTitle,
 *       title: tip.title,
 *       content: tip.tip,
 *       timestamp: new Date().toISOString()
 *     };
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Use with orchestrator
 * const formatter = new HtmlTipFormatter();
 * const orchestrator = new DefaultTipOrchestrator(loader, selector, formatter);
 * const htmlTip = orchestrator.getTip(); // Returns HTML string
 * ```
 */
export interface TipFormatter<T> {
  /**
   * Formats a tip into the desired output format.
   *
   * @param tip - The tip to format
   * @param categoryTitle - Optional category title to include in the output
   * @returns Formatted tip in the specified output type
   */
  formatTip(tip: Tip, categoryTitle?: string): T;
}

export default {
  PoisonTipFormatter,
  MarkdownTipFormatter,
  ShellTipFormatter,
  HtmlTipFormatter,
};
