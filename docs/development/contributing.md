# Contributing Guide

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build: `npm run build`

## Development Workflow

### Running Tests
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

### Building
```bash
npm run build            # Full build
npm run build:compile    # TypeScript only
npm run build:web        # Web bundle only
```

### Linting and Formatting
```bash
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run format           # Format code
npm run format:check     # Check formatting
```

## Code Standards

### SOLID Principles
All code must follow SOLID principles. See [SOLID documentation](./SOLID/) for details.

### Design Patterns
Use established design patterns. See [Design Patterns documentation](./design-patterns/) for examples.

### Documentation
- Add JSDoc comments to all public methods
- Add inline comments for complex logic
- Update relevant documentation files

## Adding New Features

### Adding a New Loader
1. Create file in `src/loaders/`
2. Implement `TipLoader` interface
3. Add tests in `src/loaders/__tests__/`
4. Export from `src/loaders/index.ts`
5. Document in architecture.md

### Adding a New Formatter
1. Create file in `src/formatters/`
2. Implement `TipFormatter<T>` interface
3. Add tests in `src/formatters/__tests__/`
4. Export from `src/formatters/index.ts`
5. Document in architecture.md

### Adding a New Selector
1. Create file in `src/selectors/`
2. Implement `TipSelector` interface
3. Add tests in `src/selectors/__tests__/`
4. Export from `src/selectors/index.ts`
5. Document in architecture.md

## Testing Guidelines

### Unit Tests
- Test each class in isolation
- Use mocks for dependencies
- Aim for 100% code coverage
- Test edge cases and error conditions

### Test Structure
```typescript
describe('ClassName', () => {
  let instance: ClassName;
  
  beforeEach(() => {
    instance = new ClassName();
  });
  
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = instance.method(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Add/update tests
4. Add/update documentation
5. Run all tests and linting
6. Submit pull request
7. Address review feedback

## Code Review Checklist

- [ ] Follows SOLID principles
- [ ] Uses appropriate design patterns
- [ ] Has comprehensive tests
- [ ] Has JSDoc documentation
- [ ] Passes all tests
- [ ] Passes linting
- [ ] Updates relevant documentation
- [ ] No breaking changes (or documented)
