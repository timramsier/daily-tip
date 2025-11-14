# Builder Pattern

## Intent

Separate the construction of a complex object from its representation so that the same construction process can create different representations.

## Implementation: DailyTipBuilder

**File**: `src/index.ts`

```typescript
export default class DailyTipBuilder<T> {
  private loader?: TipLoader;
  private selector?: TipSelector;
  private formatter?: TipFormatter<T>;
  private orchestratorClass?: new (
    loader: TipLoader,
    selector: TipSelector,
    formatter: TipFormatter<T>
  ) => TipOrchestrator<T>;

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

  withOrchestrator(orchestratorClass: new (...) => TipOrchestrator<T>): this {
    this.orchestratorClass = orchestratorClass;
    return this;
  }

  build(): TipOrchestrator<T> {
    // Validation and construction
    return new this.orchestratorClass!(this.loader!, this.selector!, this.formatter!);
  }
}
```

## Usage

```typescript
// Fluent API for construction
const orchestrator = new DailyTipBuilder<string>()
  .withLoader(new JsonTipLoader('tips.json'))
  .withSelector(new RandomTipSelector())
  .withFormatter(new HtmlTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();

const tip = orchestrator.getTip();
```

## Benefits

1. **Fluent Interface**: Readable, chainable API
2. **Flexible Construction**: Build different configurations easily
3. **Validation**: Can validate before building
4. **Immutable Product**: Once built, orchestrator is immutable
5. **Type Safety**: Generic type parameter ensures type consistency

## Different Configurations

```typescript
// CLI configuration
const cliOrchestrator = new DailyTipBuilder<string>()
  .withLoader(new JsonTipLoader('tips.json'))
  .withSelector(new RandomTipSelector())
  .withFormatter(new ShellTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();

// Web configuration
const webOrchestrator = new DailyTipBuilder<string>()
  .withLoader(new CompositeTipLoader([loader1, loader2]))
  .withSelector(new RandomTipSelector())
  .withFormatter(new HtmlTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();

// Test configuration
const testOrchestrator = new DailyTipBuilder<string>()
  .withLoader(new MockTipLoader())
  .withSelector(new MockTipSelector())
  .withFormatter(new MockTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();
```

## Related Patterns

- **Factory Method**: Builder uses factory method to create orchestrator
- **Strategy**: Builder configures strategies
- **Dependency Injection**: Builder performs dependency injection
