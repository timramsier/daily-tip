import { TipOrchestrator } from '.';
import { TipFormatter } from '../formatters';
import { Tip, TipLoader } from '../loaders';
import { TipSelector } from '../selectors';

export default class DefaultTipOrchestrator<T> implements TipOrchestrator<T> {
  private tips: Tip[];
  private selector: TipSelector;
  private formatter: TipFormatter<T>;
  private collectionTitle?: string;

  constructor(loader: TipLoader, selector: TipSelector, formatter: TipFormatter<T>) {
    this.tips = this.loadTips(loader);
    this.selector = selector;
    this.formatter = formatter;
    this.collectionTitle = this.loadCollectionTitle(loader);
  }

  getTip(): T {
    const selectedTip = this.selectTip();
    return this.formatTip(selectedTip);
  }

  private loadTips(loader: TipLoader): Tip[] {
    return loader.getTips();
  }

  private loadCollectionTitle(loader: TipLoader): string | undefined {
    return loader.getCollectionTitle?.();
  }

  private selectTip(): Tip {
    return this.selector.getTip(this.tips);
  }

  private formatTip(tip: Tip): T {
    return this.formatter.formatTip(tip, this.collectionTitle);
  }
}
