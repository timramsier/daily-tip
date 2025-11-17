import { Tip, TipLoader } from '.';

/**
 * Poison implementation of TipLoader that throws errors when used.
 *
 * This class is used as a default in the builder pattern to ensure developers
 * explicitly configure a real loader. Any attempt to use this loader will
 * result in an error, preventing accidental use of unconfigured components.
 *
 * Implements the {@link TipLoader} interface.
 *
 * @example
 * ```typescript
 * const loader = new PoisonTipLoader();
 * loader.getTips(); // Throws error
 * ```
 */
export class PoisonTipLoader implements TipLoader {
  /**
   * Throws an error indicating this is a poison implementation.
   *
   * @returns Never returns
   * @throws {Error} Always throws with message indicating poison implementation
   */
  getTips(): Tip[] {
    throw new Error('PoisonTipLoader: getTips() was called but this is a poison implementation');
  }
}
