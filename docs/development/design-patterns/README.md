# Design Patterns in Daily Tip

This folder documents the design patterns used throughout the Daily Tip codebase.

## Patterns Used

| Pattern | Purpose | Location |
|---------|---------|----------|
| **Strategy** | Interchangeable algorithms for selection, loading, formatting | All interfaces |
| **Composite** | Combine multiple loaders into one | `CompositeTipLoader` |
| **Builder** | Fluent API for constructing tip system | `DailyTipBuilder` |
| **Template Method** | Define algorithm structure in formatters | Formatter classes |
| **Dependency Injection** | Provide dependencies from outside | All constructors |
| **Factory Method** | Create orchestrators | Builder pattern |

## Quick Reference

### Strategy Pattern
- **TipLoader**: Different loading strategies (JSON, API, Composite)
- **TipSelector**: Different selection strategies (Random, Sequential)
- **TipFormatter**: Different formatting strategies (HTML, Markdown, Shell)

### Composite Pattern
- **CompositeTipLoader**: Treats single and multiple loaders uniformly

### Builder Pattern
- **DailyTipBuilder**: Fluent API for constructing the tip system

## Detailed Documentation

- [Strategy Pattern](./strategy.md)
- [Composite Pattern](./composite.md)
- [Builder Pattern](./builder.md)
- [Template Method Pattern](./template-method.md)
- [Dependency Injection](./dependency-injection.md)

## Pattern Benefits

1. **Flexibility**: Easy to swap implementations
2. **Extensibility**: Add new behaviors without modifying existing code
3. **Testability**: Mock implementations for testing
4. **Maintainability**: Clear structure and responsibilities
5. **Reusability**: Components can be reused in different contexts
