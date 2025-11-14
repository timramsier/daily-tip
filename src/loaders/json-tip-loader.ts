import { Tip, TipCollection, TipLoader } from '.';

/**
 * Loads tips from a JSON file containing a collection with title and tips array.
 *
 * This loader reads a JSON file at construction time and caches the tips and collection
 * title for subsequent retrieval. The JSON file must conform to the TipCollection structure.
 *
 * @example
 * ```typescript
 * const loader = new JsonTipLoader('./collections/leadership-tips.json');
 * const tips = loader.getTips(); // Returns array of tips
 * const title = loader.getCollectionTitle(); // Returns "Leadership Tips"
 * ```
 *
 * @implements {TipLoader}
 */
export class JsonTipLoader implements TipLoader {
  /** Cached array of tips loaded from the JSON file */
  private tips: Tip[];

  /** Cached collection title from the JSON file */
  private collectionTitle: string;

  /**
   * Creates a new JsonTipLoader and immediately loads the collection from the specified path.
   *
   * @param jsonPath - Absolute or relative path to the JSON file containing the tip collection
   * @throws {Error} If the file cannot be loaded or doesn't match the TipCollection structure
   */
  constructor(jsonPath: string) {
    const collection = this.loadCollection(jsonPath);
    this.tips = this.extractTips(collection);
    this.collectionTitle = this.extractTitle(collection);
  }

  /**
   * Retrieves all tips from the loaded collection.
   *
   * @returns Array of tips from the JSON file
   */
  getTips(): Tip[] {
    return this.tips;
  }

  /**
   * Retrieves the collection title from the loaded JSON file.
   *
   * @returns The title of the tip collection
   */
  getCollectionTitle(): string {
    return this.collectionTitle;
  }

  /**
   * Loads and parses the JSON file into a TipCollection object.
   *
   * @param jsonPath - Path to the JSON file
   * @returns Parsed TipCollection object
   * @private
   */
  private loadCollection(jsonPath: string): TipCollection {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(jsonPath);
  }

  /**
   * Extracts the tips array from a TipCollection object.
   *
   * @param collection - The loaded tip collection
   * @returns Array of tips from the collection
   * @private
   */
  private extractTips(collection: TipCollection): Tip[] {
    return collection.tips;
  }

  /**
   * Extracts the title from a TipCollection object.
   *
   * @param collection - The loaded tip collection
   * @returns The collection's title
   * @private
   */
  private extractTitle(collection: TipCollection): string {
    return collection.title;
  }
}
