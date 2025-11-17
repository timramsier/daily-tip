import { Tip } from '../loaders';
import RandomTipSelector from './random-tip';
import { PoisonTipSelector } from './poison-selector';

/**
 * Interface for selecting a tip from a collection of tips.
 *
 * Selectors implement the strategy pattern, allowing different selection
 * algorithms (random, sequential, weighted, etc.) to be used interchangeably.
 *
 * @example
 * ```typescript
 * class SequentialSelector implements TipSelector {
 *   private index = 0;
 *   getTip(tips: Tip[]): Tip {
 *     const tip = tips[this.index];
 *     this.index = (this.index + 1) % tips.length;
 *     return tip;
 *   }
 * }
 * ```
 */
export interface TipSelector {
  /**
   * Selects a single tip from the provided array.
   *
   * @param tips - Array of tips to select from
   * @returns Selected tip
   */
  getTip(tips: Tip[]): Tip;
}

export default {
  RandomTipSelector,
  PoisonTipSelector,
};
