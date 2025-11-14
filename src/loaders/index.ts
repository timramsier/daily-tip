import { CompositeTipLoader } from './composite-loader';
import { JsonTipLoader } from './json-tip-loader';
import { PoisonTipLoader } from './poison-loader';

/**
 * Represents a single tip with a title and content.
 * Immutable to ensure data integrity throughout the application.
 */
export type Tip = {
  /** The title/heading of the tip */
  readonly title: string;
  /** The main content/body of the tip, may contain markdown formatting */
  readonly tip: string;
};

/**
 * Represents a collection of tips with a descriptive title.
 * Used to group related tips together (e.g., "Leadership Tips", "Productivity Hacks").
 */
export type TipCollection = {
  /** The name/title of the collection */
  readonly title: string;
  /** Array of tips belonging to this collection */
  readonly tips: Tip[];
};

/**
 * Interface for loading tips from various sources.
 * Implementations can load from JSON files, APIs, databases, etc.
 *
 * @example
 * ```typescript
 * const loader = new JsonTipLoader('tips.json');
 * const tips = loader.getTips();
 * const title = loader.getCollectionTitle();
 * ```
 */
export interface TipLoader {
  /**
   * Retrieves all tips from the loader's source.
   * @returns Array of tips
   */
  getTips(): Tip[];

  /**
   * Optionally retrieves the collection title.
   * @returns The collection title, or undefined if not available
   */
  getCollectionTitle?(): string;
}

export default {
  JsonTipLoader,
  PoisonTipLoader,
  CompositeTipLoader,
};
