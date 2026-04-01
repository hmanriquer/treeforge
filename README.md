<div align="center">
  <h1>🌲 TreeForge</h1>
  <p><strong>A high-performance, beautiful Git client built with Tauri and React.</strong></p>
</div>

TreeForge is a modern desktop Git client designed to be fast, lightweight, and visually stunning. Built on top of the robust Tauri framework with a sleek React frontend, it aims to streamline your daily Git workflow with powerful features and an intuitive, clean interface.

---

## Features

- **Blazing Fast Performance**: Powered by Rust in the backend via Tauri, minimizing memory footprint and maximizing speed.
- **Beautiful User Interface**: A modern aesthetic leveraging TailwindCSS, Radix UI, and the Shadcn component library, complete with dark/light mode support.
- **Advanced Navigation**: Efficient and robust client-side routing using React Router.
- **Command Palette Integration**: Fast fuzzy-search and quick actions powered by `cmdk`.
- **Organized Workspace**: Features an intuitive Sidebar, interactive Repository Cards, and a functional Toolbar for managing your local repositories effortlessly.
- **Type-Safe**: Developed completely in TypeScript and Rust for reliable and scalable application architecture.
- **State Management**: Predictable state management via Zustand.

## Tech Stack

### Frontend

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

### Backend

- **Core Engine**: [Rust](https://www.rust-lang.org/)
- **Desktop Framework**: [Tauri v2](https://tauri.app/)

### Testing & Linting

- **Unit Testing**: [Vitest](https://vitest.dev/) & React Testing Library
- **Linting & Formatting**: ESLint + Prettier

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
- Operating system native build dependencies required by Tauri (see [Tauri OS Setup Guide](https://tauri.app/v1/guides/getting-started/prerequisites)).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/treeforge.git
   cd treeforge
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   # Starts the Vite dev server and the Tauri Rust backend simultaneously
   npm run tauri dev
   ```

## Project Structure

```text
treeforge/
├── src/                # React Frontend code
│   ├── assets/         # Static assets (fonts, icons, etc.)
│   ├── components/     # Reusable UI components (Sidebar, Toolbar, etc.)
│   ├── lib/            # Utility functions and library wrappers
│   ├── pages/          # Application routes/pages
│   └── stores/         # Zustand state configuration
├── src-tauri/          # Tauri Rust Backend code
│   ├── src/            # Rust source code and commands
│   ├── Cargo.toml      # Rust dependencies configuration
│   └── tauri.conf.json # Tauri application configuration
```

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts only the frontend Vite development server.
- `npm run tauri dev` - Starts the full Tauri application (Frontend + Backend).
- `npm run build` - Validates TypeScript and builds the frontend bundle.
- `npm run tauri build` - Builds the final executable for your operating system.
- `npm run test` - Runs unit tests using Vitest.
- `npm run test:ui` - Runs Vitest with the interactive UI.
- `npm run lint` - Runs ESLint to check for code quality issues.
- `npm run format` - Formats the codebase using Prettier.

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request. Before submitting, please ensure your code passes all lint checks and tests:

```bash
npm run lint:fix
npm run format
npm run test
```

## License

TO-DO
