# Strategy Pattern

## Intent

Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

## Implementation in Daily Tip

### 1. TipLoader Strategy

**Interface**: `src/loaders/index.ts`
```typescript
export interface TipLoader {
  getTips(): Tip[];
  getCollectionTitle?(): string;
}
```

**Concrete Strategies**:
- `JsonTipLoader`: Load from JSON files
- `CompositeTipLoader`: Load from multiple sources
- `ApiTipLoader`: Load from API (extensible)

**Usage**:
```typescript
// Client code doesn't care which strategy is used
class DefaultTipOrchestrator<T> {
  constructor(private loader: TipLoader) {}  // Any strategy works
  
  getTip(): T {
    const tips = this.loader.getTips();  // Polymorphic call
    // ...
  }
}
```

---

### 2. TipSelector Strategy

**Interface**: `src/selectors/index.ts`
```typescript
export interface TipSelector {
  getTip(tips: Tip[]): Tip;
}
```

**Concrete Strategies**:
- `RandomTipSelector`: Select randomly
- `SequentialTipSelector`: Select in order (extensible)
- `WeightedTipSelector`: Select by weight (extensible)

**Usage**:
```typescript
// Easy to swap selection strategies
const orchestrator1 = new DefaultTipOrchestrator(
  loader,
  new RandomTipSelector(),  // Strategy 1
  formatter
);

const orchestrator2 = new DefaultTipOrchestrator(
  loader,
  new SequentialTipSelector(),  // Strategy 2
  formatter
);
```

---

### 3. TipFormatter Strategy

**Interface**: `src/formatters/index.ts`
```typescript
export interface TipFormatter<T> {
  formatTip(tip: Tip, categoryTitle?: string): T;
}
```

**Concrete Strategies**:
- `HtmlTipFormatter`: Format as HTML
- `MarkdownTipFormatter`: Format as Markdown
- `ShellTipFormatter`: Format for terminal with colors

**Usage**:
```typescript
// Same tip, different formats
const tip = { title: 'Test', tip: 'Content' };

const html = new HtmlTipFormatter().formatTip(tip);
const markdown = new MarkdownTipFormatter().formatTip(tip);
const shell = new ShellTipFormatter().formatTip(tip);
```

---

## Benefits

### 1. Runtime Selection
```typescript
const formatter = outputFormat === 'html'
  ? new HtmlTipFormatter()
  : new MarkdownTipFormatter();

const orchestrator = new DefaultTipOrchestrator(loader, selector, formatter);
```

### 2. Easy Testing
```typescript
class MockTipLoader implements TipLoader {
  getTips(): Tip[] {
    return [{ title: 'Test', tip: 'Test tip' }];
  }
}

// Use mock strategy in tests
const orchestrator = new DefaultTipOrchestrator(
  new MockTipLoader(),
  selector,
  formatter
);
```

### 3. Open for Extension
```typescript
// Add new strategy without modifying existing code
class PriorityTipSelector implements TipSelector {
  getTip(tips: Tip[]): Tip {
    return tips.sort((a, b) => a.priority - b.priority)[0];
  }
}
```

---

## Structure

```
┌─────────────────────┐
│      Context        │
│ (Orchestrator)      │
│                     │
│  - strategy: Strategy│
│  + execute()        │
└──────────┬──────────┘
           │ uses
           ▼
┌─────────────────────┐
│   <<interface>>     │
│     Strategy        │
│  (TipLoader)        │
│                     │
│  + algorithm()      │
└──────────┬──────────┘
           │
           │ implements
    ┌──────┴──────┬──────────┐
    ▼             ▼          ▼
┌─────────┐  ┌─────────┐  ┌─────────┐
│Strategy1│  │Strategy2│  │Strategy3│
│(Json)   │  │(API)    │  │(Composite)│
└─────────┘  └─────────┘  └─────────┘
```

---

## Real-World Example

**File**: `src/bin/daily-tip.ts`

```typescript
// Create loaders for each collection
const loaders = tipTypes.map((type) => {
  const collectionPath = path.resolve(collectionsDir, `${type}.json`);
  return new JsonTipLoader(collectionPath);
});

// Use composite loader if multiple collections, otherwise use single loader
const loader = loaders.length > 1
  ? new CompositeTipLoader(loaders)  // Strategy: Composite
  : loaders[0];                       // Strategy: Single

const builder = new DailyTipBuilder<string>();
const orchestrator = builder
  .withLoader(loader)                 // Inject strategy
  .withSelector(new RandomTipSelector())  // Inject strategy
  .withFormatter(new ShellTipFormatter()) // Inject strategy
  .withOrchestrator(DefaultTipOrchestrator)
  .build();
```

---

## Related Patterns

- **Dependency Injection**: Strategies are injected into context
- **Factory Method**: Can be used to create strategies
- **Template Method**: Strategies may use template method internally
