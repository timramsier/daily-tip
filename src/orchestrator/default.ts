import { TipOrchestrator } from '.';
import { TipFormatter } from '../formatters';
import { Tip, TipLoader } from '../loaders';
import { TipSelector } from '../selectors';

/**
 * Default implementation of the tip orchestrator.
 *
 * This orchestrator coordinates the complete tip generation workflow by:
 * 1. Loading tips from the provided loader during construction
 * 2. Selecting a tip using the provided selector
 * 3. Formatting the selected tip with the provided formatter
 *
 * The orchestrator caches loaded tips and collection title for efficient
 * repeated tip generation.
 *
 * @typeParam T - The output type of the formatter (e.g., string, Buffer)
 *
 * Implements the {@link TipOrchestrator} interface.
 *
 * @example
 * ```typescript
 * // Create orchestrator with all components
 * const loader = new JsonTipLoader('tips.json');
 * const selector = new RandomTipSelector();
 * const formatter = new ShellTipFormatter();
 * const orchestrator = new DefaultTipOrchestrator(loader, selector, formatter);
 *
 * // Generate formatted tip
 * const tip = orchestrator.getTip();
 * console.log(tip);
 * ```
 *
 * @example
 * ```typescript
 * // Use with builder pattern
 * const orchestrator = new DailyTipBuilder<string>()
 *   .withLoader(new JsonTipLoader('tips.json'))
 *   .withSelector(new RandomTipSelector())
 *   .withFormatter(new HtmlTipFormatter())
 *   .withOrchestrator(DefaultTipOrchestrator)
 *   .build();
 * ```
 */
export default class DefaultTipOrchestrator<T> implements TipOrchestrator<T> {
  /** Cached array of tips loaded during construction */
  private tips: Tip[];
  
  /** Selector for choosing which tip to display */
  private selector: TipSelector;
  
  /** Formatter for converting tip to output format */
  private formatter: TipFormatter<T>;
  
  /** Optional collection title from the loader */
  private collectionTitle?: string;

  /**
   * Creates a new orchestrator and loads tips immediately.
   *
   * Tips and collection title are loaded during construction and cached
   * for efficient repeated tip generation.
   *
   * @param loader - Loader to retrieve tips from
   * @param selector - Selector to choose which tip to display
   * @param formatter - Formatter to convert tip to output format
   */
  constructor(loader: TipLoader, selector: TipSelector, formatter: TipFormatter<T>) {
    this.tips = this.loadTips(loader);
    this.selector = selector;
    this.formatter = formatter;
    this.collectionTitle = this.loadCollectionTitle(loader);
  }

  /**
   * Generates a formatted tip by selecting and formatting from loaded tips.
   *
   * This method orchestrates the complete workflow:
   * 1. Selects a tip using the configured selector
   * 2. Formats the selected tip using the configured formatter
   * 3. Returns the formatted output
   *
   * @returns Formatted tip in the specified output type
   */
  getTip(): T {
    const selectedTip = this.selectTip();
    return this.formatTip(selectedTip);
  }

  /**
   * Loads all tips from the loader.
   *
   * @param loader - Loader to retrieve tips from
   * @returns Array of loaded tips
   * @private
   */
  private loadTips(loader: TipLoader): Tip[] {
    return loader.getTips();
  }

  /**
   * Loads the optional collection title from the loader.
   *
   * @param loader - Loader to retrieve collection title from
   * @returns Collection title if available, undefined otherwise
   * @private
   */
  private loadCollectionTitle(loader: TipLoader): string | undefined {
    return loader.getCollectionTitle?.();
  }

  /**
   * Selects a tip from the cached tips using the configured selector.
   *
   * @returns Selected tip
   * @private
   */
  private selectTip(): Tip {
    return this.selector.getTip(this.tips);
  }

  /**
   * Formats the selected tip using the configured formatter.
   *
   * @param tip - Tip to format
   * @returns Formatted tip in the specified output type
   * @private
   */
  private formatTip(tip: Tip): T {
    return this.formatter.formatTip(tip, this.collectionTitle);
  }
}
