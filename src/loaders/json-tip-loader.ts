import { Tip, TipCollection, TipLoader } from '.';

/**
 * Loads tips from a JSON file that contains a collection with title and tips array
 */
export class JsonTipLoader implements TipLoader {
  private tips: Tip[];
  private collectionTitle: string;

  constructor(jsonPath: string) {
    const collection = this.loadCollection(jsonPath);
    this.tips = this.extractTips(collection);
    this.collectionTitle = this.extractTitle(collection);
  }

  getTips(): Tip[] {
    return this.tips;
  }

  getCollectionTitle(): string {
    return this.collectionTitle;
  }

  private loadCollection(jsonPath: string): TipCollection {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(jsonPath);
  }

  private extractTips(collection: TipCollection): Tip[] {
    return collection.tips;
  }

  private extractTitle(collection: TipCollection): string {
    return collection.title;
  }
}
