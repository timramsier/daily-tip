# Open/Closed Principle (OCP)

> Software entities should be open for extension but closed for modification.

## Definition

The Open/Closed Principle states that you should be able to extend a class's behavior without modifying its source code. This is achieved through abstraction and polymorphism.

## Application in Daily Tip

### ✅ Example 1: TipLoader Interface

**File**: `src/loaders/index.ts`

```typescript
export interface TipLoader {
  getTips(): Tip[];
  getCollectionTitle?(): string;
}
```

**Open for Extension**:
```typescript
// Add new loader WITHOUT modifying existing code
export class ApiTipLoader implements TipLoader {
  constructor(private apiUrl: string) {}
  
  getTips(): Tip[] {
    // Fetch from API
    return fetchTipsFromApi(this.apiUrl);
  }
  
  getCollectionTitle(): string {
    return "API Tips";
  }
}
```

**Closed for Modification**:
- `JsonTipLoader` doesn't need to change
- `CompositeTipLoader` doesn't need to change
- `DefaultTipOrchestrator` doesn't need to change
- All existing code continues to work

---

### ✅ Example 2: TipFormatter Interface

**File**: `src/formatters/index.ts`

```typescript
export interface TipFormatter<T> {
  formatTip(tip: Tip, categoryTitle?: string): T;
}
```

**Existing Implementations**:
- `HtmlTipFormatter`
- `MarkdownTipFormatter`
- `ShellTipFormatter`

**Extension Example**:
```typescript
// Add JSON formatter WITHOUT modifying existing formatters
export class JsonTipFormatter implements TipFormatter<string> {
  formatTip(tip: Tip, categoryTitle?: string): string {
    return JSON.stringify({ tip, categoryTitle }, null, 2);
  }
}

// Add PDF formatter
export class PdfTipFormatter implements TipFormatter<Buffer> {
  formatTip(tip: Tip, categoryTitle?: string): Buffer {
    return generatePdf(tip, categoryTitle);
  }
}
```

---

### ✅ Example 3: CompositeTipLoader

**File**: `src/loaders/composite-loader.ts`

The `CompositeTipLoader` itself demonstrates OCP:

```typescript
export class CompositeTipLoader implements TipLoader {
  constructor(loaders: TipLoader[]) {
    // Works with ANY TipLoader implementation
    this.tips = this.combineLoaders(loaders);
  }
}
```

**Usage**:
```typescript
// Combine existing loaders
const composite = new CompositeTipLoader([
  new JsonTipLoader('tips1.json'),
  new JsonTipLoader('tips2.json'),
]);

// Later, add new loader type WITHOUT changing CompositeTipLoader
const composite2 = new CompositeTipLoader([
  new JsonTipLoader('tips.json'),
  new ApiTipLoader('https://api.example.com/tips'),
  new DatabaseTipLoader(connection),
]);
```

---

## Benefits

### 1. Add Features Without Risk
```typescript
// Old code (untouched, still works)
const loader = new JsonTipLoader('tips.json');

// New code (extends functionality)
const apiLoader = new ApiTipLoader('https://api.com/tips');
```

### 2. Backward Compatibility
```typescript
// All existing code continues to work
function displayTip(loader: TipLoader) {
  const tips = loader.getTips();
  // Works with JsonTipLoader, ApiTipLoader, etc.
}
```

### 3. Easier Testing
```typescript
// Create test double WITHOUT modifying production code
class MockTipLoader implements TipLoader {
  getTips(): Tip[] {
    return [{ title: 'Test', tip: 'Test tip' }];
  }
}
```

---

## How We Achieve OCP

### 1. Interface-Based Design
Define behavior through interfaces, not concrete classes:
```typescript
// Depend on interface
class DefaultTipOrchestrator<T> {
  constructor(
    private loader: TipLoader,      // Interface, not JsonTipLoader
    private selector: TipSelector,  // Interface, not RandomTipSelector
    private formatter: TipFormatter<T>  // Interface, not HtmlTipFormatter
  ) {}
}
```

### 2. Dependency Injection
Inject dependencies rather than creating them:
```typescript
// Good: Open for extension
const orchestrator = new DefaultTipOrchestrator(
  new ApiTipLoader('url'),  // Can swap with any TipLoader
  new RandomTipSelector(),
  new JsonTipFormatter()
);

// Bad: Closed for extension
class BadOrchestrator {
  private loader = new JsonTipLoader('tips.json');  // Hard-coded!
}
```

### 3. Strategy Pattern
Allow behavior to be selected at runtime:
```typescript
// Different strategies, same interface
const strategies = [
  new RandomTipSelector(),
  new SequentialTipSelector(),
  new PriorityTipSelector(),
];

// Select strategy without modifying orchestrator
const orchestrator = new DefaultTipOrchestrator(
  loader,
  strategies[userChoice],
  formatter
);
```

---

## Real-World Extension Examples

### Adding Database Support
```typescript
// src/loaders/database-tip-loader.ts
export class DatabaseTipLoader implements TipLoader {
  constructor(private connection: DatabaseConnection) {}
  
  getTips(): Tip[] {
    return this.connection.query('SELECT * FROM tips');
  }
  
  getCollectionTitle(): string {
    return "Database Tips";
  }
}

// Usage - NO changes to existing code needed
const loader = new DatabaseTipLoader(dbConnection);
const orchestrator = new DefaultTipOrchestrator(
  loader,  // Works seamlessly
  new RandomTipSelector(),
  new HtmlTipFormatter()
);
```

### Adding Weighted Random Selection
```typescript
// src/selectors/weighted-tip-selector.ts
export class WeightedTipSelector implements TipSelector {
  getTip(tips: Tip[]): Tip {
    // Implement weighted random selection
    return selectWithWeights(tips);
  }
}

// Usage - NO changes to existing code needed
const orchestrator = new DefaultTipOrchestrator(
  loader,
  new WeightedTipSelector(),  // Drop-in replacement
  formatter
);
```

---

## Violations to Avoid

### ❌ Type Checking
```typescript
// BAD: Requires modification for new types
function processTip(loader: TipLoader) {
  if (loader instanceof JsonTipLoader) {
    // Special handling for JSON
  } else if (loader instanceof ApiTipLoader) {
    // Special handling for API
  }
  // Need to modify this function for each new loader type!
}
```

### ✅ Polymorphism
```typescript
// GOOD: Works with any TipLoader
function processTip(loader: TipLoader) {
  const tips = loader.getTips();  // Polymorphic call
  // No type checking needed
}
```

---

## Related Principles

- **Single Responsibility**: Makes it easier to identify extension points
- **Liskov Substitution**: Ensures extensions work correctly
- **Dependency Inversion**: Enables extension through abstractions
