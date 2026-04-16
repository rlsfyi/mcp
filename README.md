# @rlsfyi/mcp

MCP server for publishing releases to [rls.fyi](https://rls.fyi).

## Installation

```bash
npm install -g @rlsfyi/mcp
```

## Setup

1. Get your API key from [rls.fyi/dashboard](https://rls.fyi/dashboard)

2. Add to your MCP configuration:

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "rlsfyi": {
      "command": "npx",
      "args": ["-y", "@rlsfyi/mcp"],
      "env": {
        "RLSFYI_API_KEY": "rls_your_api_key_here"
      }
    }
  }
}
```

**Claude Code** (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "rlsfyi": {
      "command": "npx",
      "args": ["-y", "@rlsfyi/mcp"],
      "env": {
        "RLSFYI_API_KEY": "rls_your_api_key_here"
      }
    }
  }
}
```

## Usage

Once configured, Claude can publish releases using the `publish_release` tool:

```
When you complete a feature or fix, publish a release with:
- project: your-project-slug
- version: semver (1.0.0), date (2025-04-16), or descriptive (beta-launch)
- summary: one sentence describing what changes for the user
- changes: array of { type, title, body? }
```

### Change Types

- `feature` — new functionality
- `fix` — bug fix
- `breaking` — breaking change
- `improvement` — enhancement to existing feature
- `internal` — refactoring, deps, etc.

## Example

```
publish_release({
  project: "my-app",
  version: "1.2.0",
  summary: "Added dark mode support across the entire application",
  changes: [
    { type: "feature", title: "Dark mode toggle in settings" },
    { type: "feature", title: "System preference detection" },
    { type: "fix", title: "Fixed contrast issues in sidebar" }
  ]
})
```

Returns:
```
Release published successfully!

Release URL: https://rls.fyi/my-app/1.2.0
Project URL: https://rls.fyi/my-app
```

## License

MIT
