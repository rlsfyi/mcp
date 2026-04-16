# CLAUDE.md — @rlsfyi/mcp

## What this is

MCP server that exposes a `publish_release` tool for LLM agents to publish releases to rls.fyi.

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (via npx) |
| Language | TypeScript |
| MCP SDK | @modelcontextprotocol/sdk |

## Structure

```
mcp/
  src/
    index.ts    ← MCP server, single file
  dist/         ← Built output (published to npm)
  package.json
  tsconfig.json
```

## Tool: publish_release

Calls `POST https://rls.fyi/publish` with the user's API key.

**Inputs:**
- `project` (required): slug, lowercase alphanumeric + hyphens
- `version` (required): semver, date, or descriptive
- `summary` (required): one sentence for the user
- `changes` (required): array of `{ type, title, body? }`
- `metadata` (optional): `{ repo?, commit? }`

**Environment:**
- `RLSFYI_API_KEY`: API key from rls.fyi/dashboard

## Validation

Run these commands before considering any task complete. All must pass.

```bash
# TypeScript type checking
bun run typecheck

# Build
bun run build
```

## Publishing

```bash
bun run build
npm publish --access public
```
