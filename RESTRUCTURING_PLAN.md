# Discovery Tree Restructuring Plan

## Context

**Previous Approach**: Fork external MCP server (mcp-bun)
**New Approach**: Build in-process MCP server plugin for Claude Code

## Current State Analysis

### Existing Epic and Root
- **bts-5vg** (epic): "TypeScript Execution Tool for Claude Code"
- **bts-m2w** (root task): "In-process TypeScript execution with temp workspace [root]"

### Obsolete Tasks (to be closed)
1. **bts-te7**: "Fork mcp-bun repository"
   - Status: open
   - Reason for closing: No longer forking external server, building in-process instead

2. **bts-qv1**: "Add temp workspace and auto-cleanup to execute tools"
   - Status: open
   - Reason for closing: Was meant for modifying forked mcp-bun code

### Still-Relevant Tasks (to be migrated)
1. **bts-jz9**: "Configure Claude Code MCP integration"
   - Status: open
   - Action: Link to new root task as subtask

2. **bts-kek**: "Test with jj command execution"
   - Status: open
   - Action: Keep as test task (already properly linked via bts-jz9)

3. **bts-80k**: "Test with beads command execution"
   - Status: open
   - Action: Keep as test task (already properly linked via bts-jz9)

### Completed Tasks (keep as history)
- bts-6nb: Research existing MCP servers (closed)
- bts-cqg: Implement MCP server infrastructure (closed)
- bts-hie: Implement temp workspace creation (closed)
- bts-0xt: Implement execute_typescript tool (closed)
- bts-7bc: Add output capture (closed)
- bts-6jk: Add timeout support (closed)

## New Tree Structure

```
bts-5vg (epic): TypeScript Execution Tool for Claude Code
    └── bts-m2w (root): In-process TypeScript execution with temp workspace [root]
        ├── [NEW] Set up MCP plugin project structure
        ├── [NEW] Implement MCP server with stdio transport
        ├── [NEW] Implement execute_typescript tool handler
        ├── [NEW] Add temp workspace lifecycle management
        ├── [NEW] Add timeout and resource limits
        ├── [NEW] Add comprehensive error handling
        └── bts-jz9: Configure Claude Code MCP integration
            ├── bts-kek: Test with jj command execution
            └── bts-80k: Test with beads command execution
```

## Restructuring Actions

### Step 1: Close Obsolete Tasks
```bash
bd close bts-te7 --reason "No longer needed - building in-process tool instead of forking"
bd close bts-qv1 --reason "No longer needed - was for modifying forked mcp-bun"
```

### Step 2: Link Root to Epic
```bash
bd dep add bts-m2w bts-5vg -t parent-child
```

### Step 3: Create New Subtasks

#### 3.1: Set up MCP plugin project structure
```bash
bd create "Set up MCP plugin project structure" \
  -t task -p 1 \
  --description "Create TypeScript project with MCP SDK dependencies, build configuration, and package.json setup for Claude Code plugin" \
  --json
# Then: bd dep add <new-id> bts-m2w -t parent-child
```

#### 3.2: Implement MCP server with stdio transport
```bash
bd create "Implement MCP server with stdio transport" \
  -t task -p 1 \
  --description "Build core MCP server infrastructure with stdio communication, tool registration, and request/response handling" \
  --json
# Then: bd dep add <new-id> bts-m2w -t parent-child
```

#### 3.3: Implement execute_typescript tool handler
```bash
bd create "Implement execute_typescript tool handler" \
  -t task -p 1 \
  --description "Create tool handler that accepts TypeScript code, creates temp workspace, writes files, and executes with Bun" \
  --json
# Then: bd dep add <new-id> bts-m2w -t parent-child
```

#### 3.4: Add temp workspace lifecycle management
```bash
bd create "Add temp workspace lifecycle management" \
  -t task -p 1 \
  --description "Implement temp directory creation with unique IDs, execution isolation, and guaranteed cleanup on success/failure/timeout" \
  --json
# Then: bd dep add <new-id> bts-m2w -t parent-child
```

#### 3.5: Add timeout and resource limits
```bash
bd create "Add timeout and resource limits" \
  -t task -p 2 \
  --description "Implement configurable execution timeouts (default 30s), process killing, and resource constraints" \
  --json
# Then: bd dep add <new-id> bts-m2w -t parent-child
```

#### 3.6: Add comprehensive error handling
```bash
bd create "Add comprehensive error handling" \
  -t task -p 2 \
  --description "Handle TypeScript compilation errors, runtime errors, timeout errors, and filesystem errors with clear error messages" \
  --json
# Then: bd dep add <new-id> bts-m2w -t parent-child
```

### Step 4: Migrate Existing Tasks

#### 4.1: Link configuration task to root
```bash
bd dep add bts-jz9 bts-m2w -t parent-child
```

Note: bts-kek and bts-80k are already correctly linked as dependents of bts-jz9, so no changes needed.

### Step 5: Verify Structure
```bash
bd epic status --no-daemon
bd dep tree bts-m2w
bd ready
```

## Rationale for New Subtasks

1. **Project Structure**: Need proper TypeScript setup before any code
2. **MCP Server Core**: Foundation for all tool implementations
3. **Tool Handler**: The main functionality we're building
4. **Workspace Management**: Critical for isolation and cleanup
5. **Timeout/Limits**: Safety features for production use
6. **Error Handling**: Makes the tool robust and debuggable

## What We're NOT Creating

We're NOT recreating these closed tasks because the research and learnings are already captured:
- Research task (bts-6nb) - findings documented
- Old implementation tasks (bts-cqg, bts-hie, bts-0xt, etc.) - were for external MCP server approach

## Execution

Run the TypeScript script:
```bash
./restructure-discovery-tree.ts
```

Or run it with Bun:
```bash
bun run restructure-discovery-tree.ts
```

This will execute all the steps automatically and show the final tree structure.
