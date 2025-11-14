import { Tip, TipCollection, TipLoader } from '.';

export class CompositeTipLoader implements TipLoader {
  private tips: TipCollection;
  constructor(loaders: TipLoader[]) {
    this.tips = loaders.reduce(
      (acc: TipCollection, loader: TipLoader) => {
        const loaderTitle = loader.getCollectionTitle?.();
        const separator = acc.title && loaderTitle ? ', ' : '';

        return {
          tips: [...acc.tips, ...loader.getTips()],
          title: loaderTitle ? `${acc.title}${separator}${loaderTitle}` : acc.title,
        };
      },
      { tips: [], title: '' }
    );
  }

  getTips(): Tip[] {
    return this.tips.tips;
  }
  getCollectionTitle?(): string {
    return this.tips.title;
  }
}
