import DefaultTipOrchestrator from './default';
import { PoisonTipOrchestrator } from './poison-orchestrator';

/**
 * Interface for orchestrating the complete tip generation workflow.
 *
 * Orchestrators coordinate the loading, selection, and formatting of tips.
 * They encapsulate the entire workflow and provide a simple interface for
 * retrieving formatted tips.
 *
 * @typeParam T - The output type of the formatted tip (e.g., string, Buffer)
 *
 * @example
 * ```typescript
 * class CustomOrchestrator implements TipOrchestrator<string> {
 *   constructor(
 *     private loader: TipLoader,
 *     private selector: TipSelector,
 *     private formatter: TipFormatter<string>
 *   ) {}
 *
 *   getTip(): string {
 *     const tips = this.loader.getTips();
 *     const selected = this.selector.getTip(tips);
 *     return this.formatter.formatTip(selected);
 *   }
 * }
 * ```
 */
export interface TipOrchestrator<T> {
  /**
   * Generates and returns a formatted tip.
   *
   * @returns Formatted tip in the specified output type
   */
  getTip(): T;
}

export default {
  DefaultTipOrchestrator,
  PoisonTipOrchestrator,
};
