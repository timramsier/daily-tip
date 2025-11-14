import { Tip, TipCollection, TipLoader } from '.';

export class CompositeTipLoader implements TipLoader {
  private tips: TipCollection;
  constructor(loaders: TipLoader[]) {
    this.tips = loaders.reduce(
      (acc: TipCollection, loader: TipLoader) => {
        const loaderTitle = loader.getCollectionTitle?.();
        const separator = acc.title && loaderTitle ? ', ' : '';

        // Add collection title to each tip's title
        const loaderTips = loader.getTips().map((tip) => ({
          ...tip,
          title: loaderTitle ? `${tip.title} *${loaderTitle}*` : tip.title,
        }));

        return {
          tips: [...acc.tips, ...loaderTips],
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
