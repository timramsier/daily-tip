import { Tip, TipCollection, TipLoader } from '.';

export class CompositeTipLoader implements TipLoader {
  private tips: TipCollection;

  constructor(loaders: TipLoader[]) {
    this.tips = this.combineLoaders(loaders);
  }

  getTips(): Tip[] {
    return this.tips.tips;
  }

  getCollectionTitle?(): string {
    return this.tips.title;
  }

  private combineLoaders(loaders: TipLoader[]): TipCollection {
    return loaders.reduce(
      (acc: TipCollection, loader: TipLoader) => this.mergeLoader(acc, loader),
      this.createEmptyCollection()
    );
  }

  private mergeLoader(acc: TipCollection, loader: TipLoader): TipCollection {
    const loaderTitle = this.getLoaderTitle(loader);
    const loaderTips = this.enrichTipsWithCollectionName(loader.getTips(), loaderTitle);
    const combinedTitle = this.combineTitles(acc.title, loaderTitle);

    return {
      tips: [...acc.tips, ...loaderTips],
      title: combinedTitle,
    };
  }

  private getLoaderTitle(loader: TipLoader): string | undefined {
    return loader.getCollectionTitle?.();
  }

  private enrichTipsWithCollectionName(tips: Tip[], collectionTitle?: string): Tip[] {
    if (!collectionTitle) {
      return tips;
    }

    return tips.map((tip) => ({
      ...tip,
      title: this.appendCollectionToTitle(tip.title, collectionTitle),
    }));
  }

  private appendCollectionToTitle(title: string, collectionTitle: string): string {
    return `${title} *${collectionTitle}*`;
  }

  private combineTitles(existingTitle: string, newTitle?: string): string {
    if (!newTitle) {
      return existingTitle;
    }

    const separator = existingTitle ? ', ' : '';
    return `${existingTitle}${separator}${newTitle}`;
  }

  private createEmptyCollection(): TipCollection {
    return { tips: [], title: '' };
  }
}
