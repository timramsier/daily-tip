# Single Responsibility Principle (SRP)

> A class should have one, and only one, reason to change.

## Definition

The Single Responsibility Principle states that a class should have only one job or responsibility. If a class has more than one responsibility, those responsibilities become coupled, and changes to one responsibility may impair the class's ability to meet the others.

## Application in Daily Tip

### ✅ Good Examples

#### 1. JsonTipLoader
**File**: `src/loaders/json-tip-loader.ts`

**Single Responsibility**: Load tips from JSON files

```typescript
export class JsonTipLoader implements TipLoader {
  // Only responsible for loading from JSON
  private loadCollection(jsonPath: string): TipCollection
  private extractTips(collection: TipCollection): Tip[]
  private extractTitle(collection: TipCollection): string
}
```

**Why it follows SRP**:
- Only handles JSON file loading
- Doesn't format tips
- Doesn't select tips
- Doesn't orchestrate the process

**Reason to change**: Only if JSON loading logic needs to change

---

#### 2. RandomTipSelector
**File**: `src/selectors/random-tip.ts`

**Single Responsibility**: Select a random tip from a collection

```typescript
export default class RandomTipSelector implements TipSelector {
  getTip(tips: Tip[]): Tip {
    const randomIndex = this.generateRandomIndex(tips.length);
    return this.selectTipAtIndex(tips, randomIndex);
  }
}
```

**Why it follows SRP**:
- Only handles tip selection logic
- Doesn't load tips
- Doesn't format tips
- Uses a focused algorithm (random selection)

**Reason to change**: Only if selection algorithm needs to change

---

#### 3. HtmlTipFormatter
**File**: `src/formatters/html-formatter.ts`

**Single Responsibility**: Format tips as HTML

```typescript
export class HtmlTipFormatter implements TipFormatter<string> {
  // Only responsible for HTML formatting
  private buildMarkdown(title: string, tip: string, categoryTitle?: string): string
  private parseMarkdown(markdown: string): string
  private processTitle(title: string): string
}
```

**Why it follows SRP**:
- Only handles HTML formatting
- Doesn't load tips
- Doesn't select tips
- Doesn't handle other output formats

**Reason to change**: Only if HTML formatting requirements change

---

#### 4. DefaultTipOrchestrator
**File**: `src/orchestrator/default.ts`

**Single Responsibility**: Coordinate the tip generation process

```typescript
export default class DefaultTipOrchestrator<T> implements TipOrchestrator<T> {
  getTip(): T {
    const selectedTip = this.selectTip();
    return this.formatTip(selectedTip);
  }
}
```

**Why it follows SRP**:
- Only coordinates other components
- Delegates loading to loaders
- Delegates selection to selectors
- Delegates formatting to formatters
- Doesn't implement any of these concerns itself

**Reason to change**: Only if orchestration flow needs to change

---

### ❌ Anti-Pattern Example (What We Avoid)

```typescript
// BAD: Multiple responsibilities
class TipManager {
  // Responsibility 1: Loading
  loadFromJson(path: string): Tip[] { }
  
  // Responsibility 2: Selection
  selectRandom(tips: Tip[]): Tip { }
  
  // Responsibility 3: Formatting
  formatAsHtml(tip: Tip): string { }
  
  // Responsibility 4: Orchestration
  getTip(): string { }
}
```

**Problems**:
- Changes to JSON loading affect the entire class
- Can't reuse selection logic without loading logic
- Can't test formatting without loading and selection
- Violates SRP with 4 different reasons to change

---

## Benefits in Our Codebase

### 1. Easier Testing
Each class can be tested in isolation:
```typescript
// Test only loading logic
describe('JsonTipLoader', () => {
  it('should load tips from JSON', () => {
    const loader = new JsonTipLoader('test.json');
    expect(loader.getTips()).toHaveLength(2);
  });
});
```

### 2. Easier Maintenance
Changes are localized:
- Need to change HTML formatting? Only modify `HtmlTipFormatter`
- Need to change selection algorithm? Only modify `RandomTipSelector`
- Need to support new data source? Create new loader, don't modify existing ones

### 3. Better Reusability
Components can be reused independently:
```typescript
// Reuse RandomTipSelector with different loaders
const selector = new RandomTipSelector();
const tip1 = selector.getTip(jsonLoader.getTips());
const tip2 = selector.getTip(apiLoader.getTips());
```

### 4. Clearer Code Organization
Each file has a clear, focused purpose:
```
src/
  loaders/        # Only loading concerns
  selectors/      # Only selection concerns
  formatters/     # Only formatting concerns
  orchestrator/   # Only coordination concerns
```

## Identifying SRP Violations

Ask these questions about a class:
1. Can you describe the class's responsibility in one sentence without using "and"?
2. Would changes to different features require modifying this class?
3. Does the class have methods that operate on different sets of data?
4. Could you split the class into smaller, more focused classes?

If you answer "no" to #1 or "yes" to #2-4, you might have an SRP violation.

## Related Principles

- **Open/Closed Principle**: SRP makes it easier to extend without modification
- **Interface Segregation**: SRP at the interface level
- **Dependency Inversion**: SRP helps identify the right abstractions
