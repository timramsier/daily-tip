import { TipFormatter } from './formatters';
import { PoisonTipFormatter } from './formatters/poison-formatter';
import { TipLoader } from './loaders';
import { PoisonTipLoader } from './loaders/poison-loader';
import { TipOrchestrator } from './orchestrator';
import { PoisonTipOrchestrator } from './orchestrator/poison-orchestrator';
import { TipSelector } from './selectors';
import { PoisonTipSelector } from './selectors/poison-selector';

/**
 * Builder for constructing a DailyTip orchestrator with custom components.
 *
 * This class implements the Builder design pattern, allowing fluent configuration
 * of the tip generation system. It initializes with "poison" implementations that
 * throw errors if used, forcing explicit configuration of all components.
 *
 * @typeParam T - The output type of the formatter (e.g., string, Buffer)
 *
 * @example
 * ```typescript
 * const orchestrator = new DailyTipBuilder<string>()
 *   .withLoader(new JsonTipLoader('tips.json'))
 *   .withSelector(new RandomTipSelector())
 *   .withFormatter(new ShellTipFormatter())
 *   .withOrchestrator(DefaultTipOrchestrator)
 *   .build();
 *
 * const tip = orchestrator.getTip();
 * ```
 */
export default class DailyTipBuilder<T> {
  /** Loader for retrieving tips from a data source */
  private loader: TipLoader;
  
  /** Selector for choosing which tip to display */
  private selector: TipSelector;
  
  /** Orchestrator constructor for coordinating the tip generation workflow */
  private Orchestrator: new (
    loader: TipLoader,
    selector: TipSelector,
    formatter: TipFormatter<T>
  ) => TipOrchestrator<T>;
  
  /** Formatter for converting tips to the desired output format */
  private formatter: TipFormatter<T>;
  
  /**
   * Creates a new builder with poison implementations.
   *
   * All components are initialized with "poison" implementations that throw
   * errors if used, ensuring developers explicitly configure each component.
   */
  constructor() {
    this.loader = new PoisonTipLoader();
    this.selector = new PoisonTipSelector();
    this.Orchestrator = PoisonTipOrchestrator;
    this.formatter = new PoisonTipFormatter();
  }
  
  /**
   * Sets the loader for retrieving tips.
   *
   * @param loader - Loader implementation to use
   * @returns This builder instance for method chaining
   */
  withLoader(loader: TipLoader): this {
    this.loader = loader;
    return this;
  }
  
  /**
   * Sets the selector for choosing tips.
   *
   * @param selector - Selector implementation to use
   * @returns This builder instance for method chaining
   */
  withSelector(selector: TipSelector): this {
    this.selector = selector;
    return this;
  }

  /**
   * Sets the formatter for converting tips to output format.
   *
   * @param formatter - Formatter implementation to use
   * @returns This builder instance for method chaining
   */
  withFormatter(formatter: TipFormatter<T>): this {
    this.formatter = formatter;
    return this;
  }
  
  /**
   * Sets the orchestrator constructor for coordinating the workflow.
   *
   * @param orchestrator - Orchestrator class constructor to use
   * @returns This builder instance for method chaining
   */
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
  
  /**
   * Builds and returns the configured orchestrator instance.
   *
   * @returns Configured orchestrator ready to generate tips
   * @throws {Error} If any component is still using poison implementation
   */
  build(): TipOrchestrator<T> {
    return new this.Orchestrator(this.loader, this.selector, this.formatter);
  }
}
