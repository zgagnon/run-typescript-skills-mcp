# Discovery Tree Restructuring - Complete Guide

This directory contains a complete example of restructuring a discovery tree using the discovery-tree-workflow skill with TypeScript automation.

## What This Demonstrates

**Scenario**: TypeScript execution tool for Claude Code
- **Old approach**: Fork external MCP server (mcp-bun)
- **New approach**: Build in-process MCP server plugin
- **Challenge**: Restructure discovery tree mid-flight

## Files in This Guide

### 1. Main Restructuring Script
**File**: `restructure-discovery-tree.ts`
**Purpose**: Executable TypeScript script that performs the complete restructuring

```bash
# Run it
./restructure-discovery-tree.ts

# Or with Bun
bun run restructure-discovery-tree.ts
```

**What it does**:
1. Closes obsolete tasks from forking approach
2. Links root task to epic (proper tree structure)
3. Creates 6 new subtasks for in-process implementation
4. Links all subtasks to root with parent-child relationships
5. Migrates still-relevant tasks (config, tests)
6. Displays final tree structure

### 2. Restructuring Plan
**File**: `RESTRUCTURING_PLAN.md`
**Purpose**: Detailed plan showing what changes and why

**Key sections**:
- Current state analysis
- Obsolete vs still-relevant tasks
- New tree structure visualization
- Step-by-step execution plan
- Rationale for each change

### 3. Before/After Visualization
**File**: `TREE_BEFORE_AFTER.md`
**Purpose**: Visual comparison of tree structure before and after

**Shows**:
- Full tree structure before (mixed approach)
- Full tree structure after (clean in-process)
- Dependency types used
- Ready-to-work tasks after restructuring
- Suggested work sequence

### 4. Workflow Example
**File**: `DISCOVERY_TREE_WORKFLOW_EXAMPLE.md`
**Purpose**: Complete walkthrough of discovery tree principles applied

**Covers**:
- Just-in-time planning
- Emergent work handling
- Visual status tracking
- Each workflow step explained
- TypeScript implementation patterns
- Key learnings

### 5. TypeScript API Reference
**File**: `BD_TYPESCRIPT_API_PATTERNS.md`
**Purpose**: Complete reference for bd command automation in TypeScript

**Includes**:
- Core wrapper function pattern
- Task creation patterns (simple, batch, epic)
- Dependency management (parent-child, blocks, related)
- Status management (claim, complete, block)
- Query patterns (list, show, tree, stats)
- Discovery tree construction pattern
- Error handling patterns
- Utility functions

## Quick Start

### Option 1: Run the Restructuring Script

```bash
cd /Users/zell/mcp-servers/bun-sandbox
./restructure-discovery-tree.ts
```

This will:
- Execute all restructuring steps
- Show progress with colored output
- Display final tree structure
- Tell you what to do next

### Option 2: Follow Manual Steps

See `RESTRUCTURING_PLAN.md` for the step-by-step manual process.

### Option 3: Study the Patterns

Read `BD_TYPESCRIPT_API_PATTERNS.md` to understand how to build similar automation.

## Discovery Tree Concepts Demonstrated

### 1. Just-in-Time Planning
- Started with minimal detail (one root task)
- Discovered better approach through research
- Created breakdown only when approach was clear

### 2. Emergent Work
- Original plan: fork external server
- Discovery: in-process is better
- Tree restructured to reflect new understanding

### 3. Visual Status
- Epic shows overall progress
- Task statuses show what's done/active/blocked
- Dependencies show relationships
- Bottom-up tree shows context

### 4. Handling Pivots
- Close obsolete tasks (don't delete)
- Preserve decision history
- Create new structure for new approach
- Migrate still-relevant tasks

### 5. Parent-Child Hierarchy
```
Epic (container)
  └── Root Task (actual work)
      ├── Subtask 1
      ├── Subtask 2
      └── Configuration
          ├── Test 1
          └── Test 2
```

### 6. Ready-to-Work View
```bash
bd ready  # Shows all unblocked tasks
```

## Key TypeScript Patterns

### Pattern 1: Command Wrapper
```typescript
async function bd(args: string): Promise<any> {
  const result = await $`bash -c ${"bd " + args}`.text();
  return args.includes("--json") ? JSON.parse(result) : result;
}
```

### Pattern 2: Create and Link
```typescript
const task = await bd(`create "Title" -t task -p 1 --json`);
await bd(`dep add ${task.id} ${parentId} -t parent-child`);
```

### Pattern 3: Batch Operations
```typescript
for (const spec of taskSpecs) {
  const task = await bd(`create "${spec.title}" ...`);
  await bd(`dep add ${task.id} ${rootId} -t parent-child`);
}
```

## After Restructuring

### Check Your Work
```bash
# See epic progress
bd epic status --no-daemon

# See full tree
bd dep tree bts-m2w

# Find ready tasks
bd ready
```

### Start Working
```bash
# Pick first task
bd ready

# Claim it
bd update <task-id> --status in_progress

# Work on it...

# Complete it
bd close <task-id> --reason "Completed"

# Update parent with progress
bd update <parent-id> --notes "Completed: <what-you-did>"
```

## Learning Outcomes

After studying this example, you should understand:

1. **How to structure discovery trees**
   - Epic → Root → Subtasks hierarchy
   - When to use parent-child vs blocks dependencies

2. **How to handle pivots**
   - Close obsolete tasks with reasons
   - Create new structure for new approach
   - Preserve decision history

3. **How to automate with TypeScript**
   - Command wrapper patterns
   - Batch operations
   - Error handling
   - Progress logging

4. **Discovery tree principles**
   - Just-in-time planning
   - Emergent work
   - Visual status
   - Bottom-up context

5. **Practical workflow**
   - bd ready to find work
   - bd update to claim/complete
   - bd dep tree to see context
   - bd epic status to track progress

## Next Steps

1. **Run the script** to see it in action
2. **Read the plan** to understand the why
3. **Study the patterns** to build your own automation
4. **Apply to your work** using discovery-tree-workflow skill

## Questions?

This is a complete, working example demonstrating:
- Discovery tree workflow principles
- TypeScript automation with bd
- Handling approach changes mid-flight
- Building hierarchical task structures

All code is executable and ready to run in:
```
/Users/zell/mcp-servers/bun-sandbox/
```

## File Overview

| File | Purpose | Lines | Key Content |
|------|---------|-------|-------------|
| `restructure-discovery-tree.ts` | Main script | ~200 | Complete automation |
| `RESTRUCTURING_PLAN.md` | Detailed plan | ~200 | What/why/how |
| `TREE_BEFORE_AFTER.md` | Visualization | ~150 | Before/after comparison |
| `DISCOVERY_TREE_WORKFLOW_EXAMPLE.md` | Walkthrough | ~300 | Principles applied |
| `BD_TYPESCRIPT_API_PATTERNS.md` | API reference | ~500 | Complete patterns |
| `README_RESTRUCTURING.md` | This file | ~250 | Overview/guide |

Total: ~1,600 lines of documentation and working code demonstrating discovery tree workflow with TypeScript.
