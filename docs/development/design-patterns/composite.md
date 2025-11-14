# Composite Pattern

## Intent

Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.

## Implementation: CompositeTipLoader

**File**: `src/loaders/composite-loader.ts`

```typescript
export class CompositeTipLoader implements TipLoader {
  constructor(loaders: TipLoader[]) {
    this.tips = this.combineLoaders(loaders);
  }
  
  getTips(): Tip[] {
    return this.tips.tips;
  }
}
```

## Structure

```
        TipLoader (Component)
             ▲
             │
    ┌────────┴────────┐
    │                 │
JsonTipLoader    CompositeTipLoader
  (Leaf)           (Composite)
                       │
                   contains
                       │
                   TipLoader[]
```

## Usage

```typescript
// Single loader (leaf)
const single = new JsonTipLoader('tips.json');

// Composite loader (composite)
const composite = new CompositeTipLoader([
  new JsonTipLoader('tips1.json'),
  new JsonTipLoader('tips2.json'),
  new JsonTipLoader('tips3.json'),
]);

// Both can be used identically
function displayTips(loader: TipLoader) {
  const tips = loader.getTips();
  tips.forEach(tip => console.log(tip.title));
}

displayTips(single);     // Works
displayTips(composite);  // Works identically
```

## Benefits

1. **Uniform Treatment**: Single and composite loaders used the same way
2. **Recursive Composition**: Can nest composites within composites
3. **Simplified Client Code**: Client doesn't need to distinguish between leaf and composite
4. **Easy to Add New Components**: Just implement TipLoader interface

## Real-World Example

**File**: `src/bin/daily-tip.ts`

```typescript
const loaders = tipTypes.map(type => 
  new JsonTipLoader(path.resolve(collectionsDir, `${type}.json`))
);

// Automatically use composite for multiple loaders
const loader = loaders.length > 1
  ? new CompositeTipLoader(loaders)
  : loaders[0];
```

## Related Patterns

- **Strategy**: Composite is a strategy for combining multiple strategies
- **Decorator**: Similar structure but different intent
- **Iterator**: Often used to traverse composite structures
