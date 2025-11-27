# Run TypeScript Skills MCP Server

An MCP server that lets AI agents execute TypeScript code with access to modular APIs in `~/.claude/skills`.

## What This Enables

This MCP server provides one tool: `run-skill-code`. When enabled, your AI agent can execute TypeScript code that imports and calls functions from `~/.claude/skills`.

### Why You Might Want This

**Fast programmatic workflows**: Instead of your agent repeatedly calling command-line tools (slow, text parsing), it can call TypeScript functions directly and get structured data back.

**Richer agent capabilities**: If you've built TypeScript APIs for task management, version control workflows, data processing, or other tooling in `~/.claude/skills`, this lets agents use them programmatically.

**Better performance**: In-process execution is much faster than spawning processes for every operation.

**Type-safe interactions**: Your agent gets structured results with proper types instead of parsing text output.

### Why You Might Not Want This

**Security risk**: Code executes in-process with full file system access and no sandboxing. If your agent writes malicious code (or makes mistakes), it runs with your permissions.

**Limited use case**: Only useful if you have (or plan to build) TypeScript APIs in `~/.claude/skills`. If you don't, this MCP provides no value.

**Trust requirement**: You must trust your AI agent to write and execute code safely. There's no safety net.

**Development overhead**: You need to build and maintain the TypeScript APIs yourself.

## When to Use This

**Good fit**:
- You have TypeScript APIs in `~/.claude/skills` that you want agents to use
- You trust your AI agent to execute code safely
- You want fast, programmatic workflows
- You're comfortable with the security tradeoffs

**Not a good fit**:
- You don't have any skills/APIs for the agent to call
- You're uncomfortable with in-process code execution
- You need sandboxing or security isolation
- You prefer command-line tools

## Installation

### Prerequisites

- [Bun](https://bun.sh/) v1.0.0 or later

### Setup

```bash
git clone <repository-url>
cd run-typescript-skills-mcp
bun install
bun run build
```

### Configure Your MCP Client

**VS Code** (`.vscode/settings.json`):
```json
{
  "mcp": {
    "servers": {
      "run-typescript-skills": {
        "command": "bun",
        "args": ["/absolute/path/to/run-typescript-skills-mcp/src/mcp-bun.ts"]
      }
    }
  }
}
```

**Claude Desktop**:
```json
{
  "mcpServers": {
    "run-typescript-skills": {
      "command": "bun",
      "args": ["/absolute/path/to/run-typescript-skills-mcp/src/mcp-bun.ts"]
    }
  }
}
```

## What Your Agent Can Do

Once enabled, your agent can execute TypeScript code like:

```typescript
import { createTask } from '~/.claude/skills/my-workflow/src/api.js';

const task = await createTask({
  title: "Write documentation",
  priority: 1
});

return task;
```

The agent gets back structured data:
```json
{
  "returnValue": { "id": "task-123", "title": "Write documentation", "priority": 1 },
  "stdout": "",
  "stderr": ""
}
```

## Security Model

⚠️ **No sandboxing**: Code runs in-process with full system access.

⚠️ **Same permissions as server**: If the MCP server can access a file, so can the executed code.

⚠️ **Trust-based**: You're trusting your AI agent to write safe code.

**This is designed for**: Controlled environments where you trust your agent and want fast, programmatic access to your own TypeScript APIs.

**This is NOT designed for**: Executing untrusted code, multi-user environments, or situations requiring isolation.

## Development

```bash
bun run build        # Compile TypeScript
bun run dist         # Build optimized bundle
bun test             # Run tests
bun run dev          # Development mode with MCP Inspector
```

## Architecture

- `src/mcp-bun.ts` - MCP server entry point
- `src/tools/run-skill-code-mcp.ts` - Tool registration
- `src/tools/run-skill-code.ts` - Public API
- `src/tools/run-skill-code-impl.ts` - Implementation

See [docs/adr/](docs/adr/) for architectural decisions.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Bun Runtime](https://bun.sh/)
