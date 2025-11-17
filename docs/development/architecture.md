# Architecture Overview

## System Architecture

The Daily Tip application follows a clean, layered architecture with clear separation of concerns.

```mermaid
graph TB
    subgraph "Entry Points"
        CLI[CLI: daily-tip.ts]
        Web[Web: app.ts]
        Build[Web Build: daily-tip-web.ts]
    end
    
    subgraph "Builder Pattern"
        Builder[DailyTipBuilder]
    end
    
    subgraph "Orchestrator Layer"
        Orchestrator[DefaultTipOrchestrator]
    end
    
    subgraph "Component Layer"
        Loaders[Loaders<br/>- JsonTipLoader<br/>- CompositeTipLoader]
        Selectors[Selectors<br/>- RandomTipSelector]
        Formatters[Formatters<br/>- HtmlTipFormatter<br/>- MarkdownTipFormatter<br/>- ShellTipFormatter]
    end
    
    CLI --> Builder
    Web --> Builder
    Build --> Builder
    Builder --> Orchestrator
    Orchestrator --> Loaders
    Orchestrator --> Selectors
    Orchestrator --> Formatters
    
    style CLI fill:#e1f5ff
    style Web fill:#e1f5ff
    style Build fill:#e1f5ff
    style Builder fill:#fff4e1
    style Orchestrator fill:#ffe1f5
    style Loaders fill:#e1ffe1
    style Selectors fill:#e1ffe1
    style Formatters fill:#e1ffe1
```

## Component Relationships

```mermaid
graph TB
    subgraph Interfaces["🔷 Interfaces"]
        TipLoader["TipLoader<br/>getTips(), getCollectionTitle()"]
        TipSelector["TipSelector<br/>getTip(tips)"]
        TipFormatter["TipFormatter<br/>formatTip(tip, categoryTitle)"]
        TipOrchestrator["TipOrchestrator<br/>getTip()"]
    end
    
    subgraph Loaders["📁 Loaders"]
        JsonTipLoader["JsonTipLoader<br/>Loads from JSON files"]
        CompositeTipLoader["CompositeTipLoader<br/>Combines multiple loaders"]
    end
    
    subgraph Selectors["🎲 Selectors"]
        RandomTipSelector["RandomTipSelector<br/>Random selection"]
    end
    
    subgraph Formatters["🎨 Formatters"]
        HtmlTipFormatter["HtmlTipFormatter<br/>HTML output"]
        ShellTipFormatter["ShellTipFormatter<br/>Terminal output"]
        MarkdownTipFormatter["MarkdownTipFormatter<br/>Markdown output"]
    end
    
    subgraph Orchestrators["🎭 Orchestrators"]
        DefaultTipOrchestrator["DefaultTipOrchestrator<br/>Coordinates components"]
    end
    
    subgraph Builder["🏗️ Builder"]
        DailyTipBuilder["DailyTipBuilder<br/>Fluent API for construction"]
    end
    
    %% Interface implementations
    TipLoader -.->|implements| JsonTipLoader
    TipLoader -.->|implements| CompositeTipLoader
    TipSelector -.->|implements| RandomTipSelector
    TipFormatter -.->|implements| HtmlTipFormatter
    TipFormatter -.->|implements| ShellTipFormatter
    TipFormatter -.->|implements| MarkdownTipFormatter
    TipOrchestrator -.->|implements| DefaultTipOrchestrator
    
    %% Builder relationships
    DailyTipBuilder -->|uses| TipLoader
    DailyTipBuilder -->|uses| TipSelector
    DailyTipBuilder -->|uses| TipFormatter
    DailyTipBuilder -->|creates| DefaultTipOrchestrator
    
    %% Orchestrator relationships
    DefaultTipOrchestrator -->|uses| TipLoader
    DefaultTipOrchestrator -->|uses| TipSelector
    DefaultTipOrchestrator -->|uses| TipFormatter
    
    %% Composite pattern
    CompositeTipLoader -.->|contains| TipLoader
    
    style TipLoader fill:#e1f5ff
    style TipSelector fill:#e1f5ff
    style TipFormatter fill:#e1f5ff
    style TipOrchestrator fill:#e1f5ff
    style DailyTipBuilder fill:#fff4e1
    style DefaultTipOrchestrator fill:#ffe1f5
```

## Core Components

### 1. Loaders (`src/loaders/`)
**Responsibility**: Load tips from various sources

- `JsonTipLoader`: Loads tips from JSON files
- `CompositeTipLoader`: Combines multiple loaders (Composite Pattern)
- `PoisonTipLoader`: Test double for error scenarios

**Interface**: `TipLoader`
```typescript
interface TipLoader {
  getTips(): Tip[];
  getCollectionTitle?(): string;
}
```

### 2. Selectors (`src/selectors/`)
**Responsibility**: Choose which tip to display

- `RandomTipSelector`: Selects a random tip
- `PoisonTipSelector`: Test double for error scenarios

**Interface**: `TipSelector`
```typescript
interface TipSelector {
  getTip(tips: Tip[]): Tip;
}
```

### 3. Formatters (`src/formatters/`)
**Responsibility**: Format tips for different output mediums

- `HtmlTipFormatter`: Formats tips as HTML (for web)
- `MarkdownTipFormatter`: Formats tips as Markdown
- `ShellTipFormatter`: Formats tips for terminal with colors
- `PoisonTipFormatter`: Test double for error scenarios

**Interface**: `TipFormatter<T>`
```typescript
interface TipFormatter<T> {
  formatTip(tip: Tip, categoryTitle?: string): T;
}
```

### 4. Orchestrators (`src/orchestrator/`)
**Responsibility**: Coordinate the entire tip generation process

- `DefaultTipOrchestrator`: Standard orchestration flow
- `PoisonTipOrchestrator`: Test double for error scenarios

**Interface**: `TipOrchestrator<T>`
```typescript
interface TipOrchestrator<T> {
  getTip(): T;
}
```

### 5. Builder (`src/index.ts`)
**Responsibility**: Fluent API for constructing the tip system

- `DailyTipBuilder`: Builder pattern implementation

## Data Flow

### CLI Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI as daily-tip.ts
    participant Builder as DailyTipBuilder
    participant Orchestrator as DefaultTipOrchestrator
    participant Loader as JsonTipLoader
    participant Selector as RandomTipSelector
    participant Formatter as ShellTipFormatter
    
    User->>CLI: npm run daily-tip
    CLI->>Builder: withLoader(JsonTipLoader)
    CLI->>Builder: withSelector(RandomTipSelector)
    CLI->>Builder: withFormatter(ShellTipFormatter)
    CLI->>Builder: build()
    Builder->>Orchestrator: new DefaultTipOrchestrator()
    CLI->>Orchestrator: getTip()
    Orchestrator->>Loader: getTips()
    Loader-->>Orchestrator: Tip[]
    Orchestrator->>Selector: getTip(tips)
    Selector-->>Orchestrator: Tip
    Orchestrator->>Formatter: formatTip(tip)
    Formatter-->>Orchestrator: formatted string
    Orchestrator-->>CLI: formatted string
    CLI-->>User: Display in console
```

### Web Flow

```mermaid
sequenceDiagram
    participant Browser
    participant App as app.ts
    participant Builder as DailyTipBuilder
    participant Orchestrator as DefaultTipOrchestrator
    participant Loader as BrowserTipLoader
    participant Selector as RandomTipSelector
    participant Formatter as HtmlTipFormatter
    
    Browser->>App: Page Load
    App->>Builder: withLoader(BrowserTipLoader)
    App->>Builder: withSelector(RandomTipSelector)
    App->>Builder: withFormatter(HtmlTipFormatter)
    App->>Builder: build()
    Builder->>Orchestrator: new DefaultTipOrchestrator()
    App->>Orchestrator: getTip()
    Orchestrator->>Loader: getTips()
    Loader-->>Orchestrator: Tip[]
    Orchestrator->>Selector: getTip(tips)
    Selector-->>Orchestrator: Tip
    Orchestrator->>Formatter: formatTip(tip)
    Formatter-->>Orchestrator: HTML string
    Orchestrator-->>App: HTML string
    App-->>Browser: Render HTML
```

## Key Design Decisions

### 1. Interface-Based Design
All major components are defined by interfaces, allowing for:
- Easy testing with mock implementations
- Runtime polymorphism
- Loose coupling between components

### 2. Immutable Data Types
`Tip` and `TipCollection` are readonly, ensuring:
- Data integrity
- Predictable behavior
- Thread safety (if needed in future)

### 3. Separation of Concerns
Each layer has a single, well-defined responsibility:
- Loaders: Data acquisition
- Selectors: Selection logic
- Formatters: Presentation logic
- Orchestrators: Coordination

### 4. Dependency Injection
Components receive their dependencies through constructors:
- Testability
- Flexibility
- Explicit dependencies

## Extension Points

### Adding a New Loader
```typescript
export class ApiTipLoader implements TipLoader {
  constructor(private apiUrl: string) {}
  
  getTips(): Tip[] {
    // Fetch from API
  }
  
  getCollectionTitle(): string {
    return "API Tips";
  }
}
```

### Adding a New Formatter
```typescript
export class JsonTipFormatter implements TipFormatter<string> {
  formatTip(tip: Tip, categoryTitle?: string): string {
    return JSON.stringify({ tip, categoryTitle }, null, 2);
  }
}
```

### Adding a New Selector
```typescript
export class SequentialTipSelector implements TipSelector {
  private index = 0;
  
  getTip(tips: Tip[]): Tip {
    const tip = tips[this.index];
    this.index = (this.index + 1) % tips.length;
    return tip;
  }
}
```

## Testing Strategy

- **Unit Tests**: Each component tested in isolation
- **Integration Tests**: Orchestrator tests verify component interaction
- **Test Doubles**: Poison implementations for error scenarios
- **Mock Data**: JSON fixtures for consistent test data
