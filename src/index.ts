import { TipFormatter } from './formatters';
import { PoisonTipFormatter } from './formatters/poison-formatter';
import { TipLoader } from './loaders';
import { PoisonTipLoader } from './loaders/poison-loader';
import { TipOrchestrator } from './orchestrator';
import { PoisonTipOrchestrator } from './orchestrator/poison-orchestrator';
import { TipSelector } from './selectors';
import { PoisonTipSelector } from './selectors/poison-selector';

export default class DailyTipBuilder<T> {
  private loader: TipLoader;
  private selector: TipSelector;
  private Orchestrator: new (
    loader: TipLoader,
    selector: TipSelector,
    formatter: TipFormatter<T>
  ) => TipOrchestrator<T>;
  private formatter: TipFormatter<T>;
  constructor() {
    this.loader = new PoisonTipLoader();
    this.selector = new PoisonTipSelector();
    this.Orchestrator = PoisonTipOrchestrator;
    this.formatter = new PoisonTipFormatter();
  }
  withLoader(loader: TipLoader): this {
    this.loader = loader;
    return this;
  }
  withSelector(selector: TipSelector): this {
    this.selector = selector;
    return this;
  }

  withFormatter(formatter: TipFormatter<T>): this {
    this.formatter = formatter;
    return this;
  }
  withOrchestrator(
    orchestrator: new (
      loader: TipLoader,
      selector: TipSelector,
      formatter: TipFormatter<T>
    ) => TipOrchestrator<T>
  ): this {
    this.Orchestrator = orchestrator;
    return this;
  }
  build(): TipOrchestrator<T> {
    return new this.Orchestrator(this.loader, this.selector, this.formatter);
  }
}
