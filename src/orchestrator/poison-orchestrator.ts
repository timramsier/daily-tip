import { TipOrchestrator } from '.';

/**
 * Poison implementation of TipOrchestrator that throws errors when used.
 *
 * This class is used as a default in the builder pattern to ensure developers
 * explicitly configure a real orchestrator. Any attempt to use this orchestrator
 * will result in an error, preventing accidental use of unconfigured components.
 *
 * @typeParam T - The output type (unused as this always throws)
 *
 * Implements the {@link TipOrchestrator} interface.
 *
 * @example
 * ```typescript
 * const orchestrator = new PoisonTipOrchestrator<string>();
 * orchestrator.getTip(); // Throws error
 * ```
 */
export class PoisonTipOrchestrator<T> implements TipOrchestrator<T> {
  /**
   * Throws an error indicating this is a poison implementation.
   *
   * @returns Never returns
   * @throws {Error} Always throws with message indicating poison implementation
   */
  getTip(): T {
    throw new Error(
      'PoisonTipOrchestrator: getTip() was called but this is a poison implementation'
    );
  }
}
