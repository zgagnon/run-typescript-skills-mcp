# Discovery Tree: Before and After Restructuring

## BEFORE: Mixed Fork/In-Process Approach

```
bts-5vg (epic) - TypeScript Execution Tool for Claude Code
    └── [NOT LINKED] bts-m2w (root) - In-process TypeScript execution [root]

bts-91f (task, in_progress) - Research Claude Code client tool extension
    └── [NO DEPENDENCIES]

bts-te7 (task, open) - Fork mcp-bun repository ❌ OBSOLETE
    └── blocks → bts-qv1

bts-qv1 (task, open) - Add temp workspace to execute tools ❌ OBSOLETE
    └── blocks → bts-jz9

bts-jz9 (task, open) - Configure Claude Code MCP integration
    ├── blocks → bts-kek
    └── blocks → bts-80k

bts-kek (task, open) - Test with jj command execution
bts-80k (task, open) - Test with beads command execution

CLOSED TASKS (completed research):
- bts-6nb - Research existing MCP servers ✓
- bts-cqg - Implement MCP server infrastructure ✓
- bts-hie - Implement temp workspace creation ✓
- bts-0xt - Implement execute_typescript tool ✓
- bts-7bc - Add output capture ✓
- bts-6jk - Add timeout support ✓
```

**Problems**:
- Root task not linked to epic
- Obsolete tasks in dependency chain
- No clear subtask structure for in-process approach
- Mixed old/new approach tasks

## AFTER: Clean In-Process Structure

```
bts-5vg (epic) - TypeScript Execution Tool for Claude Code
    └── bts-m2w (root) - In-process TypeScript execution with temp workspace [root]
        ├── [NEW-1] Set up MCP plugin project structure (task, priority 1)
        │   └── Description: Create TypeScript project with MCP SDK dependencies,
        │       build configuration, and package.json setup
        │
        ├── [NEW-2] Implement MCP server with stdio transport (task, priority 1)
        │   └── Description: Build core MCP server infrastructure with stdio
        │       communication, tool registration, and request/response handling
        │
        ├── [NEW-3] Implement execute_typescript tool handler (task, priority 1)
        │   └── Description: Create tool handler that accepts TypeScript code,
        │       creates temp workspace, writes files, and executes with Bun
        │
        ├── [NEW-4] Add temp workspace lifecycle management (task, priority 1)
        │   └── Description: Implement temp directory creation with unique IDs,
        │       execution isolation, and guaranteed cleanup
        │
        ├── [NEW-5] Add timeout and resource limits (task, priority 2)
        │   └── Description: Implement configurable execution timeouts (30s default),
        │       process killing, and resource constraints
        │
        ├── [NEW-6] Add comprehensive error handling (task, priority 2)
        │   └── Description: Handle TypeScript compilation errors, runtime errors,
        │       timeout errors, and filesystem errors with clear messages
        │
        └── bts-jz9 - Configure Claude Code MCP integration (task, priority 2)
            ├── blocks → bts-kek - Test with jj command execution
            └── blocks → bts-80k - Test with beads command execution

CLOSED TASKS (obsolete approach):
- bts-te7 - Fork mcp-bun repository ❌ (closed: no longer forking)
- bts-qv1 - Add temp workspace to execute tools ❌ (closed: was for fork)

CLOSED TASKS (completed research - preserved):
- bts-6nb - Research existing MCP servers ✓
- bts-cqg - Implement MCP server infrastructure ✓
- bts-hie - Implement temp workspace creation ✓
- bts-0xt - Implement execute_typescript tool ✓
- bts-7bc - Add output capture ✓
- bts-6jk - Add timeout support ✓

ORPHANED TASK (not part of restructure):
- bts-91f - Research Claude Code client tool extension (in_progress)
```

**Improvements**:
- ✅ Root task properly linked to epic
- ✅ Clear parent-child hierarchy
- ✅ Obsolete tasks closed with reason
- ✅ All new subtasks for in-process approach
- ✅ Test tasks properly positioned
- ✅ Ready to work: can run `bd ready` to find first task

## Dependency Types Used

### Parent-Child (Hierarchy)
```
epic → root → subtasks
```
Shows tree structure, subtask completion rolls up to parent.

### Blocks (Prerequisites)
```
bts-jz9 blocks bts-kek
bts-jz9 blocks bts-80k
```
Tests can't run until configuration is complete.

## Ready-to-Work After Restructuring

Running `bd ready` will show:
```
[NEW-1] Set up MCP plugin project structure
[NEW-2] Implement MCP server with stdio transport
[NEW-3] Implement execute_typescript tool handler
[NEW-4] Add temp workspace lifecycle management
[NEW-5] Add timeout and resource limits
[NEW-6] Add comprehensive error handling
```

All new tasks are unblocked and ready to claim!

## Work Sequence

Suggested order:
1. **NEW-1**: Set up project (must be first)
2. **NEW-2**: Implement MCP server core (foundation)
3. **NEW-3**: Implement tool handler (main feature)
4. **NEW-4**: Add workspace management (critical for isolation)
5. **NEW-5**: Add timeout/limits (safety)
6. **NEW-6**: Add error handling (robustness)
7. **bts-jz9**: Configure Claude Code (integration)
8. **bts-kek**: Test with jj (validation)
9. **bts-80k**: Test with beads (validation)

## Verification Commands

After running the restructuring script:

```bash
# See epic progress
bd epic status --no-daemon

# See full tree from root
bd dep tree bts-m2w

# Find ready-to-work tasks
bd ready

# See specific task details
bd show [NEW-1]  # Replace with actual ID

# View bottom-up (any task to root)
bd dep tree bts-jz9
```

## What This Demonstrates

1. **Pivot handling**: Closed obsolete tasks rather than deleting
2. **Hierarchical structure**: Epic → Root → Subtasks → Tests
3. **Just-in-time planning**: Created breakdown when approach solidified
4. **Visible progress**: Can see exactly what's done, what's next
5. **Bottom-up context**: Any task shows path to root
6. **Emergent work**: Tree grew through discovery and research
7. **Decision preservation**: Closed tasks show what approaches were considered
