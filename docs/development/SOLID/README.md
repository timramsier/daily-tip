# SOLID Principles in Daily Tip

This folder contains detailed documentation on how each SOLID principle is applied in the Daily Tip codebase.

## SOLID Overview

SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable:

1. **[S]ingle Responsibility Principle** - A class should have one, and only one, reason to change
2. **[O]pen/Closed Principle** - Software entities should be open for extension but closed for modification
3. **[L]iskov Substitution Principle** - Derived classes must be substitutable for their base classes
4. **[I]nterface Segregation Principle** - Clients should not be forced to depend on interfaces they don't use
5. **[D]ependency Inversion Principle** - Depend on abstractions, not concretions

## Quick Reference

| Principle | Key Examples in Codebase |
|-----------|-------------------------|
| **SRP** | `JsonTipLoader` (only loads JSON), `RandomTipSelector` (only selects), `HtmlTipFormatter` (only formats) |
| **OCP** | `TipLoader` interface allows new loaders without modifying existing code |
| **LSP** | `CompositeTipLoader` can replace `JsonTipLoader` anywhere `TipLoader` is expected |
| **ISP** | Separate interfaces: `TipLoader`, `TipSelector`, `TipFormatter`, `TipOrchestrator` |
| **DIP** | `DefaultTipOrchestrator` depends on interfaces, not concrete implementations |

## Detailed Documentation

- [Single Responsibility Principle](./single-responsibility.md)
- [Open/Closed Principle](./open-closed.md)
- [Liskov Substitution Principle](./liskov-substitution.md)
- [Interface Segregation Principle](./interface-segregation.md)
- [Dependency Inversion Principle](./dependency-inversion.md)

## Benefits in Our Codebase

1. **Maintainability**: Each class has a clear, focused purpose
2. **Testability**: Components can be tested in isolation
3. **Extensibility**: New features can be added without modifying existing code
4. **Flexibility**: Components can be swapped out easily
5. **Readability**: Code structure is predictable and consistent
