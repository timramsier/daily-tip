import { Tip, TipCollection, TipLoader } from '.';

/**
 * Loads tips from a JSON file that contains a collection with title and tips array
 */
export class JsonTipLoader implements TipLoader {
  private tips: Tip[];
  private collectionTitle: string;
  constructor(jsonPath: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const collection: TipCollection = require(jsonPath);
    this.tips = collection.tips;
    this.collectionTitle = collection.title;
  }
  getTips(): Tip[] {
    return this.tips;
  }
  getCollectionTitle(): string {
    return this.collectionTitle;
  }
}
