import { TipFormatter } from '.';
import { Tip } from '../loaders';

/**
 * Poison implementation of TipFormatter that throws errors when used.
 *
 * This class is used as a default in the builder pattern to ensure developers
 * explicitly configure a real formatter. Any attempt to use this formatter will
 * result in an error, preventing accidental use of unconfigured components.
 *
 * Implements the {@link TipFormatter} interface with never return type.
 *
 * @example
 * ```typescript
 * const formatter = new PoisonTipFormatter();
 * formatter.formatTip(tip); // Throws error
 * ```
 */
export class PoisonTipFormatter implements TipFormatter<never> {
  /**
   * Throws an error indicating this is a poison implementation.
   *
   * @param _tip - Tip to format (unused)
   * @returns Never returns
   * @throws {Error} Always throws with message indicating poison implementation
   */
  formatTip(_tip: Tip): never {
    throw new Error(
      'PoisonTipFormatter: formatTip() was called but this is a poison implementation'
    );
  }
}
