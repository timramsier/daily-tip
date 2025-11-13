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
    this.tips = loader.getTips();
    this.selector = selector;
    this.formatter = formatter;
    this.collectionTitle = loader.getCollectionTitle?.();
  }
  getTip(): T {
    const tip = this.selector.getTip(this.tips);
    return this.formatter.formatTip(tip, this.collectionTitle);
  }
}
