# Liskov Substitution Principle (LSP)

> Objects of a superclass should be replaceable with objects of a subclass without breaking the application.

## Definition

If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering the correctness of the program.

## Application in Daily Tip

### ✅ Example: TipLoader Substitutability

**File**: `src/loaders/index.ts`

```typescript
interface TipLoader {
  getTips(): Tip[];
  getCollectionTitle?(): string;
}
```

**All implementations are substitutable**:

```typescript
function displayRandomTip(loader: TipLoader) {
  const tips = loader.getTips();
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  console.log(randomTip);
}

// All of these work identically
displayRandomTip(new JsonTipLoader('tips.json'));
displayRandomTip(new CompositeTipLoader([loader1, loader2]));
displayRandomTip(new ApiTipLoader('https://api.com/tips'));
```

**Why it works**:
- All return `Tip[]` from `getTips()`
- All optionally provide `getCollectionTitle()`
- No implementation throws unexpected errors
- No implementation has surprising side effects

---

### ✅ Example: CompositeTipLoader

**File**: `src/loaders/composite-loader.ts`

The `CompositeTipLoader` can be used anywhere a `TipLoader` is expected:

```typescript
// Single loader
const singleLoader: TipLoader = new JsonTipLoader('tips.json');

// Composite loader (substitutable!)
const compositeLoader: TipLoader = new CompositeTipLoader([
  new JsonTipLoader('tips1.json'),
  new JsonTipLoader('tips2.json'),
]);

// Both work identically in orchestrator
const orchestrator1 = new DefaultTipOrchestrator(singleLoader, selector, formatter);
const orchestrator2 = new DefaultTipOrchestrator(compositeLoader, selector, formatter);
```

**Contract preserved**:
- Returns `Tip[]` ✓
- Provides `getCollectionTitle()` ✓
- No unexpected exceptions ✓
- Predictable behavior ✓

---

## LSP Requirements

### 1. Preconditions cannot be strengthened
```typescript
// Base interface
interface TipLoader {
  getTips(): Tip[];  // No preconditions
}

// ✅ GOOD: Same or weaker preconditions
class JsonTipLoader implements TipLoader {
  getTips(): Tip[] {
    // Accepts any state, no additional requirements
    return this.tips;
  }
}

// ❌ BAD: Stronger preconditions
class BadLoader implements TipLoader {
  getTips(): Tip[] {
    if (!this.initialized) {
      throw new Error('Must call init() first!');  // New requirement!
    }
    return this.tips;
  }
}
```

### 2. Postconditions cannot be weakened
```typescript
// ✅ GOOD: Returns valid Tip[]
class JsonTipLoader implements TipLoader {
  getTips(): Tip[] {
    return this.tips;  // Always returns Tip[]
  }
}

// ❌ BAD: Weakens postcondition
class BadLoader implements TipLoader {
  getTips(): Tip[] {
    return null as any;  // Violates contract!
  }
}
```

### 3. Invariants must be preserved
```typescript
// Invariant: getTips() always returns an array
interface TipLoader {
  getTips(): Tip[];
}

// ✅ GOOD: Preserves invariant
class JsonTipLoader implements TipLoader {
  getTips(): Tip[] {
    return this.tips || [];  // Always an array
  }
}

// ❌ BAD: Violates invariant
class BadLoader implements TipLoader {
  getTips(): Tip[] {
    return undefined as any;  // Not an array!
  }
}
```

---

## Testing for LSP

### Test Suite Pattern
```typescript
// Generic test suite for ALL TipLoader implementations
function testTipLoader(createLoader: () => TipLoader) {
  describe('TipLoader contract', () => {
    it('should return an array from getTips()', () => {
      const loader = createLoader();
      const tips = loader.getTips();
      expect(Array.isArray(tips)).toBe(true);
    });
    
    it('should return Tip objects with title and tip', () => {
      const loader = createLoader();
      const tips = loader.getTips();
      tips.forEach(tip => {
        expect(tip).toHaveProperty('title');
        expect(tip).toHaveProperty('tip');
      });
    });
  });
}

// Apply to all implementations
testTipLoader(() => new JsonTipLoader('test.json'));
testTipLoader(() => new CompositeTipLoader([...]));
```

---

## Benefits in Our Codebase

### 1. Polymorphic Usage
```typescript
// Works with ANY TipLoader
class DefaultTipOrchestrator<T> {
  constructor(private loader: TipLoader) {}
  
  getTip(): T {
    const tips = this.loader.getTips();  // Polymorphic call
    // ...
  }
}
```

### 2. Easy Testing
```typescript
// Mock loader is substitutable
class MockTipLoader implements TipLoader {
  getTips(): Tip[] {
    return [{ title: 'Test', tip: 'Test tip' }];
  }
}

// Use in tests
const orchestrator = new DefaultTipOrchestrator(
  new MockTipLoader(),  // Substitutes for real loader
  selector,
  formatter
);
```

### 3. Flexible Composition
```typescript
// Mix and match implementations
const loader = new CompositeTipLoader([
  new JsonTipLoader('tips1.json'),
  new JsonTipLoader('tips2.json'),
  new MockTipLoader(),  // Even test doubles work!
]);
```

---

## Related Principles

- **Open/Closed**: LSP enables safe extension
- **Interface Segregation**: Smaller interfaces are easier to substitute
- **Dependency Inversion**: Depend on abstractions that follow LSP
