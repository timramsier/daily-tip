# Development Documentation

This directory contains comprehensive documentation for developers working on the Daily Tip application.

## Contents

- [SOLID Principles](./SOLID/) - How SOLID principles are applied in this codebase
- [Design Patterns](./design-patterns/) - Design patterns used throughout the application
- [Architecture Overview](./architecture.md) - High-level architecture and component relationships
- [Contributing Guide](./contributing.md) - Guidelines for contributing to the project

## Quick Start

1. **Understanding the Architecture**: Start with [architecture.md](./architecture.md) to understand the overall structure
2. **SOLID Principles**: Review the [SOLID](./SOLID/) folder to see how we maintain clean code
3. **Design Patterns**: Check [design-patterns](./design-patterns/) to understand our implementation patterns

## Key Concepts

### Tip Flow
```
Loader → Selector → Formatter → Orchestrator → Output
```

1. **Loader**: Loads tips from various sources (JSON, API, etc.)
2. **Selector**: Chooses which tip to display (random, sequential, etc.)
3. **Formatter**: Formats the tip for output (HTML, Markdown, Shell, etc.)
4. **Orchestrator**: Coordinates the entire process

### Extensibility

The application is designed to be easily extended:
- Add new loaders by implementing `TipLoader`
- Add new selectors by implementing `TipSelector`
- Add new formatters by implementing `TipFormatter<T>`
- Add new orchestrators by implementing `TipOrchestrator<T>`
