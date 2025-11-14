# Dependency Inversion Principle (DIP)

> Depend on abstractions, not concretions.

## Definition

1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
2. Abstractions should not depend on details. Details should depend on abstractions.

## Application in Daily Tip

### ✅ Example: DefaultTipOrchestrator

**File**: `src/orchestrator/default.ts`

```typescript
export default class DefaultTipOrchestrator<T> implements TipOrchestrator<T> {
  constructor(
    private loader: TipLoader,        // Abstraction, not JsonTipLoader
    private selector: TipSelector,    // Abstraction, not RandomTipSelector
    private formatter: TipFormatter<T> // Abstraction, not HtmlTipFormatter
  ) {
    this.tips = this.loadTips(loader);
    this.collectionTitle = this.loadCollectionTitle(loader);
  }
}
```

**Why it follows DIP**:
- Depends on `TipLoader` interface, not `JsonTipLoader` class
- Depends on `TipSelector` interface, not `RandomTipSelector` class
- Depends on `TipFormatter<T>` interface, not `HtmlTipFormatter` class
- Can work with ANY implementation of these interfaces

**Benefits**:
```typescript
// Can use different implementations without changing orchestrator
const orchestrator1 = new DefaultTipOrchestrator(
  new JsonTipLoader('tips.json'),
  new RandomTipSelector(),
  new HtmlTipFormatter()
);

const orchestrator2 = new DefaultTipOrchestrator(
  new ApiTipLoader('https://api.com'),
  new SequentialTipSelector(),
  new MarkdownTipFormatter()
);
```

---

### ✅ Example: CompositeTipLoader

**File**: `src/loaders/composite-loader.ts`

```typescript
export class CompositeTipLoader implements TipLoader {
  constructor(loaders: TipLoader[]) {  // Depends on abstraction
    this.tips = this.combineLoaders(loaders);
  }
  
  private combineLoaders(loaders: TipLoader[]): TipCollection {
    return loaders.reduce(
      (acc: TipCollection, loader: TipLoader) => this.mergeLoader(acc, loader),
      this.createEmptyCollection()
    );
  }
}
```

**Why it follows DIP**:
- Accepts array of `TipLoader` interface, not concrete classes
- Works with `JsonTipLoader`, `ApiTipLoader`, or any other implementation
- Doesn't know or care about concrete implementations

---

## Dependency Flow

### Traditional (Bad) Dependency Flow
```
High-Level Module → Low-Level Module
(Orchestrator)   → (JsonTipLoader)
```

### Inverted (Good) Dependency Flow
```
High-Level Module → Abstraction ← Low-Level Module
(Orchestrator)   → (TipLoader) ← (JsonTipLoader)
```

Both depend on the abstraction!

---

## Implementation Techniques

### 1. Constructor Injection
```typescript
class DefaultTipOrchestrator<T> {
  constructor(
    private loader: TipLoader,      // Injected dependency
    private selector: TipSelector,  // Injected dependency
    private formatter: TipFormatter<T> // Injected dependency
  ) {}
}
```

### 2. Interface-Based Design
```typescript
// Define abstraction
export interface TipLoader {
  getTips(): Tip[];
}

// Concrete implementations depend on abstraction
export class JsonTipLoader implements TipLoader {
  getTips(): Tip[] { /* ... */ }
}

export class ApiTipLoader implements TipLoader {
  getTips(): Tip[] { /* ... */ }
}
```

### 3. Builder Pattern
```typescript
// Builder facilitates dependency injection
const orchestrator = new DailyTipBuilder<string>()
  .withLoader(new JsonTipLoader('tips.json'))
  .withSelector(new RandomTipSelector())
  .withFormatter(new HtmlTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();
```

---

## Benefits

### 1. Testability
```typescript
// Easy to inject test doubles
const mockLoader: TipLoader = {
  getTips: () => [{ title: 'Test', tip: 'Test tip' }],
  getCollectionTitle: () => 'Test Collection'
};

const orchestrator = new DefaultTipOrchestrator(
  mockLoader,  // Test double
  selector,
  formatter
);
```

### 2. Flexibility
```typescript
// Swap implementations at runtime
const loader = isProduction
  ? new ApiTipLoader(apiUrl)
  : new JsonTipLoader('test-tips.json');

const orchestrator = new DefaultTipOrchestrator(loader, selector, formatter);
```

### 3. Maintainability
```typescript
// Add new implementations without changing high-level code
class DatabaseTipLoader implements TipLoader {
  getTips(): Tip[] {
    return this.db.query('SELECT * FROM tips');
  }
}

// Orchestrator doesn't need to change
const orchestrator = new DefaultTipOrchestrator(
  new DatabaseTipLoader(db),
  selector,
  formatter
);
```

---

## Related Principles

- **Open/Closed**: DIP enables extension without modification
- **Liskov Substitution**: Ensures abstractions work correctly
- **Interface Segregation**: Minimal abstractions are easier to depend on
