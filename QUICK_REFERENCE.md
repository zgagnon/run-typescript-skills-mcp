# Quick Reference: Discovery Tree Restructuring with TypeScript

## TL;DR

**What**: Complete TypeScript automation for restructuring a discovery tree
**Where**: `/Users/zell/mcp-servers/bun-sandbox/`
**Run**: `./restructure-discovery-tree.ts`

## The Complete Solution

### Core TypeScript Code (restructure-discovery-tree.ts)

```typescript
#!/usr/bin/env bun
import { $ } from "bun";

// 1. Command wrapper with JSON parsing
async function bd(args: string): Promise<any> {
  const result = await $`bash -c ${"bd " + args}`.text();
  return args.includes("--json") ? JSON.parse(result) : result;
}

// 2. Close obsolete tasks
async function closeObsoleteTasks() {
  await bd(`close bts-te7 --reason "No longer forking external server"`);
  await bd(`close bts-qv1 --reason "Was for modifying forked code"`);
}

// 3. Link root to epic
async function linkRootToEpic(rootId: string, epicId: string) {
  await bd(`dep add ${rootId} ${epicId} -t parent-child`);
}

// 4. Create and link subtasks
async function createSubtasks(rootId: string) {
  const subtasks = [
    { title: "Set up MCP plugin project structure", priority: 1 },
    { title: "Implement MCP server with stdio transport", priority: 1 },
    { title: "Implement execute_typescript tool handler", priority: 1 },
    { title: "Add temp workspace lifecycle management", priority: 1 },
    { title: "Add timeout and resource limits", priority: 2 },
    { title: "Add comprehensive error handling", priority: 2 }
  ];

  for (const task of subtasks) {
    const result = await bd(
      `create "${task.title}" -t task -p ${task.priority} --json`
    );
    await bd(`dep add ${result.id} ${rootId} -t parent-child`);
  }
}

// 5. Migrate existing tasks
async function migrateExistingTasks(rootId: string) {
  await bd(`dep add bts-jz9 ${rootId} -t parent-child`);
  // bts-kek and bts-80k already linked via bts-jz9
}

// 6. Main workflow
async function main() {
  const EPIC_ID = "bts-5vg";
  const ROOT_ID = "bts-m2w";

  await closeObsoleteTasks();
  await linkRootToEpic(ROOT_ID, EPIC_ID);
  await createSubtasks(ROOT_ID);
  await migrateExistingTasks(ROOT_ID);

  // Show results
  await bd("epic status --no-daemon");
  await bd(`dep tree ${ROOT_ID}`);
  await bd("ready");
}

main();
```

## Key Patterns

### Pattern 1: Command Wrapper
```typescript
async function bd(args: string): Promise<any> {
  const result = await $`bash -c ${"bd " + args}`.text();
  return args.includes("--json") ? JSON.parse(result) : result;
}
```

### Pattern 2: Create and Link
```typescript
const task = await bd(`create "Task Title" -t task -p 1 --json`);
await bd(`dep add ${task.id} ${parentId} -t parent-child`);
```

### Pattern 3: Close Obsolete
```typescript
await bd(`close ${taskId} --reason "Explanation of why obsolete"`);
```

### Pattern 4: Batch Create
```typescript
for (const spec of taskSpecs) {
  const result = await bd(`create "${spec.title}" -t task -p 1 --json`);
  await bd(`dep add ${result.id} ${rootId} -t parent-child`);
}
```

## Tree Structure

### Before
```
bts-5vg (epic)
bts-m2w (root) [NOT LINKED]
bts-te7 (obsolete) → blocks → bts-qv1 (obsolete) → blocks → bts-jz9
```

### After
```
bts-5vg (epic)
  └── bts-m2w (root)
      ├── [NEW] Set up project
      ├── [NEW] Implement server
      ├── [NEW] Implement tool
      ├── [NEW] Workspace mgmt
      ├── [NEW] Timeout/limits
      ├── [NEW] Error handling
      └── bts-jz9 (config)
          ├── bts-kek (test jj)
          └── bts-80k (test beads)
```

## File Guide

| File | Size | Purpose |
|------|------|---------|
| `restructure-discovery-tree.ts` | 7.6K | Main executable script |
| `RESTRUCTURING_PLAN.md` | 5.7K | Detailed plan |
| `TREE_BEFORE_AFTER.md` | 6.0K | Visual comparison |
| `DISCOVERY_TREE_WORKFLOW_EXAMPLE.md` | 7.3K | Principles walkthrough |
| `BD_TYPESCRIPT_API_PATTERNS.md` | 12K | Complete API reference |
| `README_RESTRUCTURING.md` | 6.8K | Overview and guide |
| `QUICK_REFERENCE.md` | This file | Quick lookup |

**Total: ~51K of documentation + working code**

## Commands Cheatsheet

### Run Restructuring
```bash
./restructure-discovery-tree.ts
```

### Check Results
```bash
bd epic status --no-daemon  # Epic progress
bd dep tree bts-m2w         # Full tree
bd ready                    # Ready-to-work tasks
```

### Start Working
```bash
bd ready                              # Find first task
bd update <task-id> --status in_progress  # Claim it
bd close <task-id> --reason "Done"   # Complete it
```

## Discovery Tree Principles

1. **Just-in-Time Planning**: Plan when you know, not before
2. **Emergent Work**: Tree grows as understanding deepens
3. **Visual Status**: Always know what's done/active/blocked
4. **Handle Pivots**: Close obsolete, create new structure
5. **Parent-Child**: Epic → Root → Subtasks hierarchy

## TypeScript Best Practices

1. **Always use `--json`** for parsing responses
2. **Create and link atomically** to maintain tree structure
3. **Close with reasons** to preserve decision history
4. **Validate before operations** (check IDs, priority ranges)
5. **Log progress** for debugging and visibility

## Dependency Types

| Type | Command | Use Case |
|------|---------|----------|
| `parent-child` | `bd dep add <child> <parent> -t parent-child` | Hierarchy |
| `blocks` | `bd dep add <blocked> <blocker> -t blocks` | Prerequisites |
| `related` | `bd dep add <task1> <task2> -t related` | Soft links |
| `discovered-from` | `bd dep add <new> <source> -t discovered-from` | Emerged work |

## Complete Example Flow

```typescript
// 1. Create structure
const epic = await bd(`create "Epic" -t epic -p 1 --json`);
const root = await bd(`create "Root [root]" -t task -p 1 --json`);
await bd(`dep add ${root.id} ${epic.id} -t parent-child`);

// 2. Add subtasks
const subtasks = ["Task 1", "Task 2", "Task 3"];
for (const title of subtasks) {
  const task = await bd(`create "${title}" -t task -p 1 --json`);
  await bd(`dep add ${task.id} ${root.id} -t parent-child`);
}

// 3. Check results
await bd("epic status --no-daemon");
await bd(`dep tree ${root.id}`);
await bd("ready");
```

## What Makes This Discovery Tree?

- ✅ Just-in-time planning (created breakdown when approach clear)
- ✅ Emergent structure (grew through research and discovery)
- ✅ Visual status (epic/tree/ready commands)
- ✅ Handle pivots (closed obsolete tasks)
- ✅ Hierarchical (epic → root → subtasks)
- ✅ Bottom-up context (any task shows path to root)
- ✅ Ready-to-work (always know next step)

## Next Steps

1. **Run**: `./restructure-discovery-tree.ts`
2. **Check**: `bd ready`
3. **Claim**: `bd update <task-id> --status in_progress`
4. **Work**: Build the feature
5. **Complete**: `bd close <task-id> --reason "Done"`
6. **Track**: `bd epic status --no-daemon`

## Resources

- Main script: `/Users/zell/mcp-servers/bun-sandbox/restructure-discovery-tree.ts`
- Full docs: See other markdown files in this directory
- Discovery tree skill: `discovery-tree-workflow`
- BD documentation: Run `bd --help`

## Key Insight

**Discovery trees aren't planned upfront - they grow through work.**

Start minimal → discover complexity → add to tree → repeat.

This example shows how to automate that growth with TypeScript while preserving the emergent, just-in-time nature of discovery trees.
