# Daily Tip

A flexible, extensible tip-of-the-day system with support for multiple collections, output formats, and delivery methods.

## Features

- 📚 **Multiple Collections**: Combine tips from different sources
- 🎨 **Multiple Output Formats**: HTML, Markdown, and styled terminal output
- 🎲 **Random Selection**: Get a different tip each time
- 🔧 **Extensible Architecture**: Easy to add new loaders, selectors, and formatters
- 🌐 **CLI and Web**: Use from command line or deploy as a web app
- 🧪 **Well-Tested**: Comprehensive test coverage with clean architecture

## Quick Start

### Installation

```bash
npm install
npm run build
```

### CLI Usage

Display a random tip from a single collection:
```bash
npm run daily-tip leadership-tone
```

Display a random tip from multiple collections:
```bash
npm run daily-tip leadership-tone productivity-hacks
```

Or use the convenience scripts:
```bash
npm run daily-tip:leadership     # Leadership tips only
npm run daily-tip:productivity   # Productivity tips only
npm run daily-tip:all           # All collections combined
```

### Web Usage

Build and serve the web version:
```bash
npm run build:web
npm run serve
```

Then open your browser to:
- `http://localhost:8080` - Select a collection
- `http://localhost:8080?type=leadership-tone` - Specific collection
- `http://localhost:8080?type=leadership-tone,productivity-hacks` - Multiple collections

## Project Structure

```
daily-tip/
├── src/
│   ├── loaders/          # Load tips from various sources
│   ├── selectors/        # Select which tip to display
│   ├── formatters/       # Format tips for different outputs
│   ├── orchestrator/     # Coordinate the tip generation process
│   ├── bin/             # CLI entry points
│   └── web/             # Web application
├── collections/         # Tip collections (JSON files)
├── docs/               # Documentation
└── dist/               # Built output
```

## Usage Examples

### CLI Examples

```bash
# Single collection
node dist/bin/daily-tip.js leadership-tone

# Multiple collections (shows collection name with each tip)
node dist/bin/daily-tip.js leadership-tone productivity-hacks

# Help
node dist/bin/daily-tip.js --help
```

### Programmatic Usage

```typescript
import DailyTipBuilder from './src/index';
import { JsonTipLoader } from './src/loaders/json-tip-loader';
import RandomTipSelector from './src/selectors/random-tip';
import { HtmlTipFormatter } from './src/formatters/html-formatter';
import DefaultTipOrchestrator from './src/orchestrator/default';

// Build the tip system
const orchestrator = new DailyTipBuilder<string>()
  .withLoader(new JsonTipLoader('./collections/leadership-tone.json'))
  .withSelector(new RandomTipSelector())
  .withFormatter(new HtmlTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();

// Get a tip
const tip = orchestrator.getTip();
console.log(tip);
```

### Using Multiple Collections

```typescript
import { CompositeTipLoader } from './src/loaders/composite-loader';

const loader = new CompositeTipLoader([
  new JsonTipLoader('./collections/leadership-tone.json'),
  new JsonTipLoader('./collections/productivity-hacks.json'),
]);

const orchestrator = new DailyTipBuilder<string>()
  .withLoader(loader)
  .withSelector(new RandomTipSelector())
  .withFormatter(new ShellTipFormatter())
  .withOrchestrator(DefaultTipOrchestrator)
  .build();

const tip = orchestrator.getTip();
```

## Adding New Collections

Create a JSON file in the `collections/` directory:

```json
{
  "title": "My Tips",
  "tips": [
    {
      "title": "First Tip",
      "tip": "This is the content of the first tip. You can use **markdown** formatting."
    },
    {
      "title": "Second Tip",
      "tip": "This is another tip with a list:\n- Item 1\n- Item 2\n- Item 3"
    }
  ]
}
```

Then use it:
```bash
npm run daily-tip my-tips
```

## Extending the System

### Adding a New Loader

Create a class that implements the `TipLoader` interface:

```typescript
import { TipLoader, Tip } from './src/loaders';

export class ApiTipLoader implements TipLoader {
  constructor(private apiUrl: string) {}
  
  getTips(): Tip[] {
    // Fetch tips from API
    const response = fetch(this.apiUrl);
    return response.json();
  }
  
  getCollectionTitle(): string {
    return "API Tips";
  }
}
```

### Adding a New Formatter

Create a class that implements the `TipFormatter<T>` interface:

```typescript
import { TipFormatter } from './src/formatters';
import { Tip } from './src/loaders';

export class JsonTipFormatter implements TipFormatter<string> {
  formatTip(tip: Tip, categoryTitle?: string): string {
    return JSON.stringify({ tip, categoryTitle }, null, 2);
  }
}
```

### Adding a New Selector

Create a class that implements the `TipSelector` interface:

```typescript
import { TipSelector } from './src/selectors';
import { Tip } from './src/loaders';

export class SequentialTipSelector implements TipSelector {
  private index = 0;
  
  getTip(tips: Tip[]): Tip {
    const tip = tips[this.index];
    this.index = (this.index + 1) % tips.length;
    return tip;
  }
}
```

## Development

### Running Tests

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

### Building

```bash
npm run build            # Full build (compile + web)
npm run build:compile    # TypeScript compilation only
npm run build:web        # Web bundle only
```

### Linting and Formatting

```bash
npm run lint             # Check for linting issues
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
```

### Development Workflow

1. Make changes to source files in `src/`
2. Run tests: `npm test`
3. Build: `npm run build`
4. Test CLI: `npm run daily-tip`
5. Test web: `npm run serve`

## Architecture

The system follows SOLID principles and uses several design patterns:

- **Strategy Pattern**: Interchangeable loaders, selectors, and formatters
- **Composite Pattern**: Combine multiple loaders into one
- **Builder Pattern**: Fluent API for constructing the tip system
- **Dependency Injection**: Components receive dependencies through constructors

For detailed architecture documentation, see [development/architecture.html](development/architecture.html).

## Documentation

### Generated API Documentation

After building, you can view the complete API documentation:

```bash
npm run build        # Generates docs in dist/public/docs/
npm run docs:serve   # Serves docs at http://localhost:8081
```

Or generate docs separately:
```bash
npm run docs         # Generate API docs and convert development docs to HTML
```

The documentation includes:
- **API Documentation**: TypeDoc-generated API reference at `/docs/index.html`
- **Development Documentation**: Converted markdown docs at `/docs/development/`

### Developer Documentation

- [Architecture Overview](development/architecture.html)
- [SOLID Principles](development/SOLID/README.html)
- [Design Patterns](development/design-patterns/README.html)
- [Contributing Guide](development/contributing.html)

## Available Collections

- **Leadership Tone**: Tips for effective leadership communication
- **Productivity Hacks**: Practical productivity techniques

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build` | Full build (compile + web) |
| `npm run build:compile` | Compile TypeScript |
| `npm run build:web` | Build web bundle |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Check linting |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code |
| `npm run daily-tip` | Run CLI (requires args) |
| `npm run daily-tip:leadership` | Leadership tips |
| `npm run daily-tip:productivity` | Productivity tips |
| `npm run daily-tip:all` | All collections |
| `npm run serve` | Serve web app |
| `npm run docs` | Generate API documentation |
| `npm run docs:serve` | Serve API docs at port 8081 |

## Requirements

- Node.js 18+ (recommended)
- npm 10+

## License

ISC

## Contributing

Contributions are welcome! Please read the [Contributing Guide](development/contributing.html) for details on our code of conduct and the process for submitting pull requests.

## Tips for Success

1. **Start Simple**: Begin with a single collection and the CLI
2. **Explore Collections**: Try different collections to see the variety
3. **Combine Collections**: Use multiple collections for diverse tips
4. **Extend It**: Add your own loaders, selectors, or formatters
5. **Read the Docs**: Check out the architecture and design pattern docs

## Troubleshooting

### Build Errors

If you encounter build errors:
```bash
npm run clean
npm install
npm run build
```

### Test Failures

If tests fail:
```bash
npm run test:coverage
```
Check the coverage report to identify issues.

### Web App Not Loading

Make sure you've built the web bundle:
```bash
npm run build:web
npm run serve
```

## Support

For issues, questions, or contributions, please refer to the [Contributing Guide](development/contributing.html).
