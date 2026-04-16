# @rlsfyi/mcp

MCP server for publishing releases to [rls.fyi](https://rls.fyi). Works with any MCP-capable host, including Claude Code, Claude Desktop, Cursor, Windsurf, and Zed.

The server communicates over stdio using the standard Model Context Protocol, so any host that speaks MCP can use it.

## Installation

No install step is required — the examples below use `npx` to fetch the latest version on demand. If you prefer a pinned global install:

```bash
npm install -g @rlsfyi/mcp
```

## Setup

1. Get your API key from [rls.fyi/dashboard](https://rls.fyi/dashboard).
2. Add the server to your host's MCP configuration (see the table below).
3. Restart the host.

### Host configuration

The JSON snippet is identical for Claude Code, Claude Desktop, Cursor, and Windsurf — only the destination file differs. Zed uses a slightly different shape (see below).

| Host           | Config file                                                                |
| -------------- | -------------------------------------------------------------------------- |
| Claude Code    | `.mcp.json` (project, team-shared) or `~/.claude.json` (user/local scope)  |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS), `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Cursor         | `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global)              |
| Windsurf       | `~/.codeium/windsurf/mcp_config.json`                                      |
| Zed            | `.zed/settings.json` (project) or `~/.config/zed/settings.json` (user)     |

**Claude Code / Claude Desktop / Cursor / Windsurf:**

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

**Zed** (uses `context_servers`, not `mcpServers`):

```json
{
  "context_servers": {
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

Other MCP-capable hosts should accept one of these two shapes; consult the host's own MCP docs for the destination path.

### Project rules

To teach the agent when to call `publish_release`, add a short instruction snippet to your project's rules file. The [rls.fyi dashboard](https://rls.fyi/dashboard) generates the snippet for you.

| Host                 | Rules file             |
| -------------------- | ---------------------- |
| Claude Code          | `CLAUDE.md`            |
| Cursor               | `.cursor/rules/rls.mdc`|
| Windsurf             | `.windsurf/rules/rls.md` |
| Other / generic      | `AGENTS.md`            |

## Tools

### `publish_release`

Publishes a release to rls.fyi.

**Inputs:**
- `project` (string, required) — slug, lowercase alphanumeric plus hyphens
- `version` (string, required) — semver (`1.2.0`), date (`2025-04-16`), or descriptive (`beta-launch`)
- `summary` (string, required) — one sentence describing what changes for the user
- `changes` (array, required) — items of `{ type, title, body? }`
- `metadata` (object, optional) — `{ repo?, commit? }`

**Change types:** `feature`, `fix`, `breaking`, `improvement`, `internal`.

### `patch_release`

Updates an already-published release on rls.fyi. At least one of `summary` or `changes` must be provided.

**Inputs:**
- `project` (string, required) — slug
- `version` (string, required) — version of the release to update
- `summary` (string, optional) — replacement one-sentence summary
- `changes` (array, optional) — replacement list of `{ type, title, body? }`

**Change types:** `feature`, `fix`, `breaking`, `improvement`, `internal`.

### `delete_release`

Removes a previously published release.

**Inputs:**
- `project` (string, required)
- `version` (string, required)

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
