# Better T Stack - Zentio Project

A modern full-stack application built with the latest technologies, featuring both web and desktop applications.

## Project Structure

This project is organized as a monorepo with separate applications:

### Applications

- **`apps/web`** - React 19 web application (port 3001)
  - Built with Vite, TanStack Router, and Tailwind CSS v4
  - Pure web application without desktop dependencies
- **`apps/desktop`** - Tauri desktop application (port 3002)

  - Built with the same React stack as the web app
  - Uses Tauri for native desktop functionality
  - Cross-platform desktop application (Windows, macOS, Linux)

- **`apps/server`** - Hono backend with tRPC API
  - Authentication with Better Auth
  - Database integration with Drizzle ORM and PostgreSQL

### Packages

- **`packages/app`** - Shared React application code
  - Contains all React components, routes, and business logic
  - Shared between web and desktop applications
  - Uses TanStack Router, Query, and Form
- **`packages/ui`** - Shared UI components (Shadcn/ui)
- **`packages/db`** - Database schema and configuration
- Additional shared packages as needed

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- Rust (for desktop app development)

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

Run all applications in development mode:

```bash
pnpm dev
```

Run specific applications:

```bash
# Web application only (http://localhost:3001)
pnpm dev:web

# Desktop application only
pnpm dev:desktop

# Server only
pnpm dev:server
```

### Building

Build all applications:

```bash
pnpm build
```

Build specific applications:

```bash
# Build web application
pnpm build:web

# Build desktop application
pnpm build:desktop
```

### Database

```bash
# Push database schema
pnpm db:push

# Open database studio
pnpm db:studio

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate
```

## Technology Stack

### Frontend (Both Web & Desktop)

- **React 19** with TypeScript
- **TanStack Router v1** - File-based routing
- **TanStack Query v5** - Data fetching and caching
- **TanStack Form v1** - Form handling
- **Vite v6** - Build tool and dev server
- **Tailwind CSS v4** - Styling framework
- **Shadcn/ui** - Component library

### Desktop Specific

- **Tauri v2** - Cross-platform desktop app framework
- **Rust** - Backend for desktop application

### Backend

- **Hono v4** - Web framework
- **tRPC v11** - Type-safe API layer
- **Better Auth** - Authentication
- **Drizzle ORM** - Database toolkit
- **PostgreSQL** - Database

### Development Tools

- **pnpm** - Package manager
- **Turbo** - Monorepo build system
- **TypeScript** - Type system
- **Zod** - Schema validation

## Port Configuration

- **Web App**: http://localhost:3001
- **Desktop App**: http://localhost:3002 (for development)
- **Server**: http://localhost:3000 (default)

## Architecture

Both the web and desktop applications share the same React codebase and components, ensuring feature parity while leveraging platform-specific capabilities through Tauri for the desktop version.
