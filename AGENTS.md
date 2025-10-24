# Coding Agent Guidelines for Chef

## Commands

- **Build**: `pnpm run build` (Remix Vite build)
- **Dev**: `pnpm run dev` (frontend) + `npx convex dev` (backend, separate terminal)
- **Test**: `pnpm run test` (all tests), `vitest run <path>` (single test file)
- **Lint**: `pnpm run lint` (check), `pnpm run lint:fix` (fix)
- **Typecheck**: `pnpm run typecheck`

## Code Style

- **Imports**: Use `~/` for app paths, `@convex/` for convex paths. NO relative imports (`../`). Type imports use `import type { ... }`.
- **Formatting**: Prettier (120 chars, single quotes except in `convex/` and `template/` dirs which use double quotes)
- **TypeScript**: Strict mode. No unused vars except prefixed with `_`. Use `verbatimModuleSyntax`.
- **React**: Functional components, hooks. Import from `react` not `@remix-run/react` for base React features.
- **Naming**: PascalCase for components, camelCase for functions/vars, SCREAMING_SNAKE_CASE for constants.
- **Comments**: NO comments unless necessary for complex logic.

## Convex-Specific Rules (see .cursor/rules/convex_rules.mdc)

- **Functions**: Use new syntax with `query/mutation/action({ args: {...}, returns: v.type(), handler: async (ctx, args) => {...} })`
- **Validators**: Always include `args` and `returns` validators. Use `v.null()` for functions returning nothing.
- **Internal functions**: Use `internalQuery/internalMutation/internalAction` for private functions.
- **Calls**: Use `ctx.runQuery/runMutation/runAction` with function references from `api` or `internal` objects.
- **IDs**: Use strict types like `Id<"tableName">` not `string`.
- **Env vars**: Use `globalThis.process.env` not `process.env` (shimmed for browser/server).

## Project Structure

- `app/`: Client code (Remix), `~/` imports
- `convex/`: Backend database functions, `@convex/` imports
- `chef-agent/`: Agentic loop, prompts, tools
- `template/`: Chef project template

## Testing

- Vitest + `convex-test` for Convex functions
- Check package.json scripts for specific test commands

## MCP Tools

### Svelte 5 MCP Server

When working with Svelte 5 code in the `template/` directory, use the `svelte5` MCP tools:

- **Search knowledge**: Use for concepts about runes ($state, $derived, $effect, $props, etc.), snippets, and reactivity patterns
- **Find examples**: Search for code patterns and implementations
- **Generate components**: Create Svelte 5 components using curated patterns
- **Audit code**: Review Svelte 5 code for best practices and optimization opportunities
- **Explain concepts**: Get detailed explanations with examples

Example prompts:

- "use svelte5 to search for $state examples"
- "use svelte5 to audit this component for Svelte 5 best practices"
- "use svelte5 to find snippet patterns"

### Chrome DevTools MCP Server

For browser testing, performance analysis, and debugging:

- **Performance analysis**: Record traces and get actionable insights
- **Screenshots**: Capture page visuals at specific states
- **Network inspection**: Analyze requests/responses, check headers
- **Console logs**: Access browser console messages and errors
- **Automation**: Click, fill forms, drag, hover, navigate pages
- **Debugging**: Execute scripts, take DOM snapshots, handle dialogs
- **Emulation**: CPU throttling, network conditions, viewport sizing

Example prompts:

- "Check the performance of https://example.com"
- "Take a screenshot of the homepage"
- "Analyze network requests for the login flow"
- "Click the submit button and verify the console for errors"
