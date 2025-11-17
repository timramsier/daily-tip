import { TipSelector } from '.';
import { Tip } from '../loaders';

/**
 * Poison implementation of TipSelector that throws errors when used.
 *
 * This class is used as a default in the builder pattern to ensure developers
 * explicitly configure a real selector. Any attempt to use this selector will
 * result in an error, preventing accidental use of unconfigured components.
 *
 * Implements the {@link TipSelector} interface.
 *
 * @example
 * ```typescript
 * const selector = new PoisonTipSelector();
 * selector.getTip(tips); // Throws error
 * ```
 */
export class PoisonTipSelector implements TipSelector {
  /**
   * Throws an error indicating this is a poison implementation.
   *
   * @param _tips - Array of tips (unused)
   * @returns Never returns
   * @throws {Error} Always throws with message indicating poison implementation
   */
  getTip(_tips: Tip[]): Tip {
    throw new Error('PoisonTipSelector: getTip() was called but this is a poison implementation');
  }
}
