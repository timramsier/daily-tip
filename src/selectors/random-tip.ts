import { TipSelector } from '.';
import { Tip } from '../loaders';

/**
 * Selector that randomly chooses a tip from the available tips.
 *
 * This selector uses JavaScript's Math.random() to generate a random index
 * and select a tip from the provided array. Each tip has an equal probability
 * of being selected.
 *
 * Implements the {@link TipSelector} interface.
 *
 * @example
 * ```typescript
 * const selector = new RandomTipSelector();
 * const tips = [
 *   { title: 'Tip 1', tip: 'Content 1' },
 *   { title: 'Tip 2', tip: 'Content 2' },
 *   { title: 'Tip 3', tip: 'Content 3' }
 * ];
 * const selectedTip = selector.getTip(tips);
 * // Returns one of the three tips randomly
 * ```
 *
 * @example
 * ```typescript
 * // Use with orchestrator
 * const orchestrator = new DefaultTipOrchestrator(
 *   loader,
 *   new RandomTipSelector(),
 *   formatter
 * );
 * ```
 */
export default class RandomTipSelector implements TipSelector {
  /**
   * Selects a random tip from the provided array.
   *
   * Uses Math.random() to generate a random index within the array bounds
   * and returns the tip at that index. Each tip has equal probability of
   * being selected.
   *
   * @param tips - Array of tips to select from
   * @returns Randomly selected tip
   * @throws {TypeError} If tips array is empty (array access will return undefined)
   */
  getTip(tips: Tip[]): Tip {
    const randomIndex = this.generateRandomIndex(tips.length);
    return this.selectTipAtIndex(tips, randomIndex);
  }

  /**
   * Generates a random index within the specified length.
   *
   * @param length - Maximum length (exclusive upper bound)
   * @returns Random integer from 0 to length-1
   * @private
   */
  private generateRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }

  /**
   * Retrieves the tip at the specified index.
   *
   * @param tips - Array of tips
   * @param index - Index to retrieve
   * @returns Tip at the specified index
   * @private
   */
  private selectTipAtIndex(tips: Tip[], index: number): Tip {
    return tips[index];
  }
}
