import { Tip, TipCollection, TipLoader } from '.';

/**
 * Combines multiple tip loaders into a single unified loader.
 *
 * This loader implements the Composite design pattern, allowing multiple tip sources
 * to be treated as a single loader. It merges tips from all provided loaders and
 * appends collection names to tip titles for identification.
 *
 * Implements the {@link TipLoader} interface.
 *
 * @example
 * ```typescript
 * const loader1 = new JsonTipLoader('leadership.json');
 * const loader2 = new JsonTipLoader('productivity.json');
 * const composite = new CompositeTipLoader([loader1, loader2]);
 *
 * // Returns tips from both collections
 * const allTips = composite.getTips();
 * // Returns "Leadership Tips, Productivity Hacks"
 * const title = composite.getCollectionTitle();
 * ```
 */
export class CompositeTipLoader implements TipLoader {
  /** Combined collection containing all tips from all loaders */
  private tips: TipCollection;

  /**
   * Creates a new CompositeTipLoader by combining multiple loaders.
   *
   * @param loaders - Array of TipLoader instances to combine
   */
  constructor(loaders: TipLoader[]) {
    this.tips = this.combineLoaders(loaders);
  }

  /**
   * Retrieves all tips from all combined loaders.
   * Each tip's title is enriched with its collection name in italic format.
   *
   * @returns Array of tips from all loaders
   */
  getTips(): Tip[] {
    return this.tips.tips;
  }

  /**
   * Retrieves the combined collection title.
   * Titles are joined with commas (e.g., "Leadership Tips, Productivity Hacks").
   *
   * @returns Combined title of all collections
   */
  getCollectionTitle?(): string {
    return this.tips.title;
  }

  /**
   * Combines all loaders into a single TipCollection.
   * Uses reduce to iteratively merge each loader's tips and title.
   *
   * @param loaders - Array of loaders to combine
   * @returns Combined TipCollection
   * @private
   */
  private combineLoaders(loaders: TipLoader[]): TipCollection {
    return loaders.reduce(
      (acc: TipCollection, loader: TipLoader) => this.mergeLoader(acc, loader),
      this.createEmptyCollection()
    );
  }

  /**
   * Merges a single loader into the accumulated collection.
   * Enriches tips with collection names and combines titles.
   *
   * @param acc - Accumulated collection so far
   * @param loader - Loader to merge into the accumulator
   * @returns Updated TipCollection with merged data
   * @private
   */
  private mergeLoader(acc: TipCollection, loader: TipLoader): TipCollection {
    const loaderTitle = this.getLoaderTitle(loader);
    const loaderTips = this.enrichTipsWithCollectionName(loader.getTips(), loaderTitle);
    const combinedTitle = this.combineTitles(acc.title, loaderTitle);

    return {
      tips: [...acc.tips, ...loaderTips],
      title: combinedTitle,
    };
  }

  /**
   * Safely retrieves the collection title from a loader.
   *
   * @param loader - Loader to get title from
   * @returns Collection title or undefined if not available
   * @private
   */
  private getLoaderTitle(loader: TipLoader): string | undefined {
    return loader.getCollectionTitle?.();
  }

  /**
   * Enriches tip titles with their collection name in italic format.
   * If no collection title is provided, returns tips unchanged.
   *
   * @param tips - Array of tips to enrich
   * @param collectionTitle - Optional collection title to append
   * @returns Array of tips with enriched titles
   * @private
   */
  private enrichTipsWithCollectionName(tips: Tip[], collectionTitle?: string): Tip[] {
    if (!collectionTitle) {
      return tips;
    }

    return tips.map((tip) => ({
      ...tip,
      title: this.appendCollectionToTitle(tip.title, collectionTitle),
    }));
  }

  /**
   * Appends collection title to a tip title in italic markdown format.
   * Format: "Tip Title *Collection Name*"
   *
   * @param title - Original tip title
   * @param collectionTitle - Collection name to append
   * @returns Enhanced title with collection name
   * @private
   */
  private appendCollectionToTitle(title: string, collectionTitle: string): string {
    return `${title} *${collectionTitle}*`;
  }

  /**
   * Combines two collection titles with comma separation.
   * Handles empty titles gracefully.
   *
   * @param existingTitle - Current accumulated title
   * @param newTitle - New title to add
   * @returns Combined title string
   * @private
   */
  private combineTitles(existingTitle: string, newTitle?: string): string {
    if (!newTitle) {
      return existingTitle;
    }

    const separator = existingTitle ? ', ' : '';
    return `${existingTitle}${separator}${newTitle}`;
  }

  /**
   * Creates an empty TipCollection to use as the initial accumulator.
   *
   * @returns Empty TipCollection with no tips and empty title
   * @private
   */
  private createEmptyCollection(): TipCollection {
    return { tips: [], title: '' };
  }
}
