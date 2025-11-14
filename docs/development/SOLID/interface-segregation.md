# Interface Segregation Principle (ISP)

> Clients should not be forced to depend on interfaces they don't use.

## Definition

No client should be forced to depend on methods it does not use. ISP splits interfaces that are very large into smaller and more specific ones so that clients will only have to know about the methods that are of interest to them.

## Application in Daily Tip

### ✅ Example: Separate, Focused Interfaces

We have **four distinct interfaces** instead of one monolithic interface:

#### 1. TipLoader Interface
**File**: `src/loaders/index.ts`
```typescript
export interface TipLoader {
  getTips(): Tip[];
  getCollectionTitle?(): string;
}
```
**Purpose**: Only loading concerns

#### 2. TipSelector Interface
**File**: `src/selectors/index.ts`
```typescript
export interface TipSelector {
  getTip(tips: Tip[]): Tip;
}
```
**Purpose**: Only selection concerns

#### 3. TipFormatter Interface
**File**: `src/formatters/index.ts`
```typescript
export interface TipFormatter<T> {
  formatTip(tip: Tip, categoryTitle?: string): T;
}
```
**Purpose**: Only formatting concerns

#### 4. TipOrchestrator Interface
**File**: `src/orchestrator/index.ts`
```typescript
export interface TipOrchestrator<T> {
  getTip(): T;
}
```
**Purpose**: Only orchestration concerns

---

### ❌ Anti-Pattern: Fat Interface

What we **avoid**:

```typescript
// BAD: Monolithic interface
interface TipManager {
  // Loading methods
  loadFromJson(path: string): void;
  loadFromApi(url: string): void;
  getTips(): Tip[];
  
  // Selection methods
  selectRandom(): Tip;
  selectSequential(): Tip;
  selectByPriority(): Tip;
  
  // Formatting methods
  formatAsHtml(tip: Tip): string;
  formatAsMarkdown(tip: Tip): string;
  formatAsJson(tip: Tip): string;
  
  // Orchestration methods
  orchestrate(): string;
}
```

**Problems**:
- Clients that only need loading must depend on formatting methods
- Clients that only need selection must depend on loading methods
- Changes to formatting affect all clients
- Difficult to implement (must implement ALL methods)
- Violates Single Responsibility Principle

---

## Benefits of Segregated Interfaces

### 1. Minimal Dependencies

```typescript
// Only depends on what it needs
class RandomTipSelector implements TipSelector {
  // Only implements getTip()
  // Doesn't need to know about loading or formatting
  getTip(tips: Tip[]): Tip {
    return tips[Math.floor(Math.random() * tips.length)];
  }
}
```

### 2. Easier Implementation

```typescript
// Simple to implement - only one method
class HtmlTipFormatter implements TipFormatter<string> {
  formatTip(tip: Tip, categoryTitle?: string): string {
    // Only implement formatting logic
    return this.buildMarkdown(title, tip, categoryTitle);
  }
}
```

### 3. Flexible Composition

```typescript
// Mix and match implementations
const orchestrator = new DefaultTipOrchestrator(
  new JsonTipLoader('tips.json'),      // Implements TipLoader
  new RandomTipSelector(),              // Implements TipSelector
  new HtmlTipFormatter()                // Implements TipFormatter
);

// Easy to swap individual components
const orchestrator2 = new DefaultTipOrchestrator(
  new JsonTipLoader('tips.json'),      // Same loader
  new SequentialTipSelector(),          // Different selector
  new MarkdownTipFormatter()            // Different formatter
);
```

### 4. Better Testing

```typescript
// Test only what you need
describe('RandomTipSelector', () => {
  it('should select a tip', () => {
    const selector = new RandomTipSelector();
    const tips = [
      { title: 'Tip 1', tip: 'Content 1' },
      { title: 'Tip 2', tip: 'Content 2' },
    ];
    
    const selected = selector.getTip(tips);
    expect(tips).toContain(selected);
  });
});
```

---

## Optional Methods

### Appropriate Use: getCollectionTitle()

```typescript
export interface TipLoader {
  getTips(): Tip[];
  getCollectionTitle?(): string;  // Optional
}
```

**Why this is okay**:
- Core functionality (`getTips()`) is required
- Optional method is truly optional - clients can work without it
- Doesn't force implementations to provide it
- Doesn't force clients to use it

**Usage**:
```typescript
// Client can safely check for optional method
const title = loader.getCollectionTitle?.() || 'Default Title';
```

---

## Real-World Example: Builder Pattern

**File**: `src/index.ts`

The builder uses segregated interfaces:

```typescript
export default class DailyTipBuilder<T> {
  withLoader(loader: TipLoader): this {
    // Only needs TipLoader interface
    this.loader = loader;
    return this;
  }
  
  withSelector(selector: TipSelector): this {
    // Only needs TipSelector interface
    this.selector = selector;
    return this;
  }
  
  withFormatter(formatter: TipFormatter<T>): this {
    // Only needs TipFormatter interface
    this.formatter = formatter;
    return this;
  }
}
```

**Benefits**:
- Each `with*` method depends on minimal interface
- Can add new loaders without affecting selectors
- Can add new formatters without affecting loaders
- Clear separation of concerns

---

## Identifying ISP Violations

Ask these questions:
1. Does the interface have methods that some implementations leave empty?
2. Do clients need to know about methods they don't use?
3. Could the interface be split into smaller, more focused interfaces?
4. Do changes to one part of the interface affect unrelated clients?

If you answer "yes" to any of these, you might have an ISP violation.

---

## Related Principles

- **Single Responsibility**: ISP is SRP applied to interfaces
- **Open/Closed**: Segregated interfaces make extension easier
- **Dependency Inversion**: Depend on minimal abstractions
