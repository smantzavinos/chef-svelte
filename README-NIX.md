# Chef Development with Nix

This project includes a Nix flake for reproducible development environments.

## Prerequisites

- [Nix with flakes enabled](https://nixos.wiki/wiki/Flakes#Enable_flakes)
- [direnv](https://direnv.net/) (recommended for automatic shell activation)

## Quick Start

### 1. Using direnv (Recommended)

```bash
# Install direnv if you haven't already
# On macOS: brew install direnv
# On Ubuntu: sudo apt install direnv

# Hook direnv into your shell
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
# or for zsh:
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc

# Allow the flake in this directory
direnv allow
```

The development environment will be automatically loaded when you enter the directory.

### 2. Manual Shell Activation

```bash
# Enter the development shell
nix develop

# Or run a specific command in the shell
nix develop --command pnpm install
```

## Development Workflow

Once inside the development shell:

### Option 1: Easy Startup Script

```bash
# Install dependencies (one-time)
pnpm i

# Start both frontend and backend with one command
./start-dev.sh

# Visit the application
# http://127.0.0.1:5173
```

### Option 2: Manual Startup

```bash
# Install dependencies (one-time)
pnpm i

# Start the development server (terminal 1)
pnpm run dev

# In another terminal, start the Convex backend (terminal 2)
npx convex dev

# Visit the application
# http://127.0.0.1:5173
```

## What's Included in the Environment

- **Node.js 20.19.0** - Matches the project's .nvmrc
- **pnpm** - Package manager for the workspace
- **TypeScript** - Type checking and compilation
- **Vite** - Build tool and dev server
- **Convex CLI** - Backend development
- **Playwright** - Browser automation (for chefshot)
- **ESLint & Prettier** - Code formatting and linting
- **Native dependencies** - All system libraries needed for Node.js modules

## Workspace Structure

This is a pnpm workspace with the following packages:

- **Root** - Main Remix application
- **chef-agent** - AI agent logic and prompts
- **chefshot** - Browser automation testing
- **test-kitchen** - Evaluation framework
- **template** - SvelteKit template (migrated from React)

## Environment Variables

The project includes a pre-configured `.env.local` for development. For production or custom setups, copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Key variables:

- `CONVEX_DEPLOYMENT` - Your Convex project URL
- `VITE_CONVEX_URL` - Frontend Convex URL (defaults to local dev server)
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk authentication (for template)
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - AI provider keys

**Note**: The current `.env.local` is configured for local development with Convex running on `http://127.0.0.1:3210`.

## Building

```bash
# Build the application
pnpm run build

# Build with the Nix package
nix build .#chef-package
```

## Troubleshooting

### Playwright Browsers

If Playwright browsers aren't found:

```bash
# Install browsers manually
npx playwright install chromium

# Or use the Nix-provided browsers
export PLAYWRIGHT_BROWSERS_PATH=$(nix eval --raw .#devShells.${system}.default.buildInputs.playwright-driver.browsers)
```

### Native Dependencies

If you encounter issues with native Node.js modules, the flake includes all necessary system libraries:

- libffi, cairo, pango - For canvas/image processing
- libjpeg, libpng, libwebp - For image formats
- sqlite - For database operations
- openssl - For secure connections

### Convex CLI

The Convex CLI is wrapped to work with pnpm:

```bash
# This works in the Nix shell
npx convex dev

# Or use the wrapped version directly
convex dev
```

## Development Tips

1. **Use 127.0.0.1 instead of localhost** - Required for WorkOS authentication
2. **Reload the page after starting** - Hot reloading may need a page refresh
3. **Run Convex in a separate terminal** - The backend runs independently
4. **Check the shell hook** - Run `echo $SHELL_HOOK` to see environment setup

## Contributing

When making changes to the flake:

1. Test with `nix flake check`
2. Update the shell hook if adding new tools
3. Document any new environment variables in `.env.example`

## Resources

- [Nix Flakes Documentation](https://nixos.wiki/wiki/Flakes)
- [direnv Documentation](https://direnv.net/)
- [Chef Development Guide](./DEVELOPMENT.md)
- [Convex Documentation](https://docs.convex.dev/)
