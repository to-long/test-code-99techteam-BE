# Problem 5: Backend API

A REST API built with Hono and SQL.js for managing stacks and cards.

## Tech Stack

- **Runtime**: Node.js with tsx
- **Framework**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Database**: [SQL.js](https://sql.js.org/) - SQLite in JavaScript
- **Documentation**: Swagger/OpenAPI (auto-generated from JSDoc)

## Prerequisites

Before running this project, make sure you have the following installed globally:

### 1. Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (via PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

Verify installation:
```bash
bun --version
```

### 2. Install pnpm

```bash
# Using npm
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm
```

Verify installation:
```bash
pnpm --version
```

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Run database migrations

```bash
bun run db:migrate
```

### Start development server

```bash
bun run dev
```

Server runs at http://localhost:8000

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run start` | Start production server |
| `bun run build` | Build TypeScript |
| `bun run db:migrate` | Run database migrations |
| `bun run generate:swagger` | Generate OpenAPI spec from JSDoc |

## API Endpoints

### General

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check |

### Stacks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stacks` | Get all stacks with card counts |
| GET | `/api/stacks/search` | Search stacks by name |
| GET | `/api/stacks/:id` | Get stack by ID with cards |
| POST | `/api/stacks` | Create a new stack |
| PUT | `/api/stacks/:id` | Update a stack |
| DELETE | `/api/stacks/:id` | Delete a stack and its cards |

### Cards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards` | Get all cards |
| GET | `/api/cards/search` | Search cards by name/description |
| GET | `/api/cards/:id` | Get card by ID |
| GET | `/api/stacks/:stackId/cards` | Get cards in a stack |
| POST | `/api/stacks/:stackId/cards` | Create a card in a stack |
| PUT | `/api/cards/:id` | Update a card |
| DELETE | `/api/cards/:id` | Delete a card |
| PATCH | `/api/cards/:id/move` | Move card to another stack |

## Swagger Documentation

Access interactive API docs at: http://localhost:8000/swagger

To regenerate after route changes:

```bash
bun run generate:swagger
```

## Project Structure

Using **Feature Slice Pattern** - code is organized by feature/domain rather than by type.

```
apps/be/
├── db/
│   ├── index.ts          # Database initialization
│   ├── migrate.ts        # Migration runner
│   └── migrations/       # SQL migrations
├── public/
│   ├── swagger.html      # Swagger UI
│   └── swagger.json      # OpenAPI spec
├── src/
│   ├── main.ts           # Entry point
│   ├── generate-swagger.ts
│   ├── shared/           # Shared utilities
│   │   └── db.ts         # Database connection
│   └── features/         # Feature slices
│       ├── general/
│       │   └── general.route.ts
│       ├── stacks/
│       │   ├── stacks.route.ts
│       │   ├── stacks.store.ts
│       │   └── stacks.types.ts
│       └── cards/
│           ├── cards.route.ts
│           ├── cards.store.ts
│           └── cards.types.ts
├── data.db               # SQLite database file
├── package.json
└── tsconfig.json
```

Each feature folder contains all related code (routes, stores, types) for that domain, making it easier to maintain and scale.

## Database

SQLite database stored in `data.db`. Tables:

- **stacks**: id, name, cover_type, cover_value, created_at
- **cards**: id, stack_id, name, cover, description, created_at

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | Server port |


## Database

SQLite database stored at `apps/be/data.db`. Migrations run automatically before server start.

```bash
# Run migrations manually
cd apps/be && pnpm db:migrate
### Resetting the Database

If you need to reset the development database to a clean state, you can run:

```bash
cd apps/be && pnpm db:reset
```

This will drop all tables and re-run all migrations.

_**Note:**_ Only use this in development/testing. Running `db:reset` will erase **all** data from the database.

```

