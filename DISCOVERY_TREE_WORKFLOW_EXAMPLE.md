# Discovery Tree Workflow: Complete Example

This document shows the complete workflow used to restructure the TypeScript execution tool discovery tree, demonstrating all key concepts from the discovery-tree-workflow skill.

## Initial Situation

**Problem**: Started with forking approach, discovered better approach (in-process) mid-stream

**Discovery Tree State**:
- Had epic and root task created (bts-5vg, bts-m2w)
- Had obsolete tasks from old approach (bts-te7, bts-qv1)
- Had some still-relevant tasks (bts-jz9, bts-kek, bts-80k)

## Discovery Tree Principles Applied

### 1. Just-in-Time Planning
- **Did NOT plan all details upfront**
- Started with one root task describing user value
- Discovered need to change approach through research (bts-6nb)
- **Now restructuring** based on new understanding

### 2. Emergent Work
- Original plan: Fork external server
- **Emerged during work**: In-process is better
- Captured new approach in tree structure
- Closed obsolete tasks rather than deleting (keeps history)

### 3. Visual Status
- Epic shows overall progress
- Task statuses (open/in_progress/closed) show what's done
- Dependencies show what's blocking what
- Bottom-up tree view shows full context

## Workflow Steps Demonstrated

### Step 1: Close Obsolete Tasks (Handle Pivots)

When approach changes, **close tasks rather than delete** to preserve history:

```typescript
// Close tasks that are no longer relevant
await bd(`close bts-te7 --reason "No longer needed - building in-process tool instead"`);
await bd(`close bts-qv1 --reason "No longer needed - was for modifying forked mcp-bun"`);
```

**Why close instead of delete?**
- Preserves decision history
- Shows what approaches were considered
- Helps others understand the project evolution

### Step 2: Link Root Task to Epic

Every discovery tree needs this structure:

```typescript
// Epic = container for all work
// Root task = actual work item with subtasks
await bd(`dep add ${rootId} ${epicId} -t parent-child`);
```

**Structure**:
```
Epic (container)
  └── Root Task (actual work)
      ├── Subtask 1
      ├── Subtask 2
      └── Subtask 3
```

### Step 3: Create Subtasks (Breakdown Conversation)

Break root task into manageable pieces based on **current understanding**:

```typescript
const subtasks = [
  {
    title: "Set up MCP plugin project structure",
    description: "Create TypeScript project with MCP SDK dependencies...",
    priority: 1
  },
  // ... more subtasks
];

for (const task of subtasks) {
  // Create the task
  const result = await bd(
    `create "${task.title}" -t task -p ${task.priority} ` +
    `--description "${task.description}" --json`
  );

  // Link to parent (root task)
  await bd(`dep add ${result.id} ${rootId} -t parent-child`);
}
```

**Key points**:
- Each subtask is concrete and actionable
- Descriptions explain what needs to be done
- Priority indicates order (but can change)
- All linked to parent for tree structure

### Step 4: Migrate Still-Relevant Tasks

Not everything from old approach is obsolete:

```typescript
// bts-jz9 (Configure Claude Code) is still needed
// Link it to new root task
await bd(`dep add bts-jz9 ${rootId} -t parent-child`);

// Test tasks (bts-kek, bts-80k) remain relevant
// They're already blocked by bts-jz9, so tree structure preserved
```

**Migration strategies**:
- Keep tasks that are approach-agnostic
- Relink them to new structure
- Preserve existing dependencies where valid

### Step 5: Verify Structure

Always verify the tree makes sense:

```typescript
// See epic progress
await bd("epic status --no-daemon");

// See full tree from root
await bd(`dep tree ${rootId}`);

// Find ready-to-work tasks
await bd("ready");
```

## TypeScript Implementation Patterns

### Pattern 1: Wrapper Function for bd Commands

```typescript
async function bd(args: string): Promise<any> {
  const cmd = `bd ${args}`;
  console.log(`  $ ${cmd}`);

  const result = await $`bash -c ${cmd}`.text();

  // Parse JSON if --json flag used
  if (args.includes("--json")) {
    return JSON.parse(result);
  }

  return result;
}
```

**Why?**
- Consistent error handling
- Automatic JSON parsing
- Easy to add logging/debugging

### Pattern 2: Batch Task Creation with Linking

```typescript
const createdIds: string[] = [];

for (const taskSpec of subtasks) {
  // Create task
  const result = await bd(
    `create "${taskSpec.title}" -t task -p ${taskSpec.priority} --json`
  );

  createdIds.push(result.id);

  // Immediately link to parent
  await bd(`dep add ${result.id} ${parentId} -t parent-child`);
}

return createdIds; // Can use later if needed
```

**Why?**
- Creates and links atomically
- Tracks created IDs for later use
- Ensures tree structure is built correctly

### Pattern 3: Section-Based Logging

```typescript
function section(title: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(title);
  console.log("=".repeat(60));
}

section("STEP 1: Close Obsolete Tasks");
// ... do work ...

section("STEP 2: Link Root to Epic");
// ... do work ...
```

**Why?**
- Makes script output readable
- Shows progress clearly
- Easy to see what step failed if error occurs

## Key Learnings

### 1. Trees Over Lists
**Bad**: Flat list of tasks
```
- Task 1
- Task 2
- Task 3
- Task 4
```

**Good**: Hierarchical tree
```
Root
  ├── Setup
  │   ├── Project structure
  │   └── Dependencies
  └── Implementation
      ├── Core feature
      └── Error handling
```

### 2. Close, Don't Delete
**Bad**: Delete obsolete tasks (loses history)

**Good**: Close with reason (preserves decision trail)
```typescript
bd close bts-te7 --reason "Approach changed to in-process implementation"
```

### 3. Link Immediately
**Bad**: Create all tasks, then try to link them later

**Good**: Create and link atomically
```typescript
const result = await bd(`create "..." --json`);
await bd(`dep add ${result.id} ${parentId} -t parent-child`);
```

### 4. Parent-Child for Hierarchy
Use `parent-child` dependency type for tree structure:
```typescript
bd dep add <child-id> <parent-id> -t parent-child
```

Use `blocks` for prerequisites:
```typescript
bd dep add <blocked-id> <blocker-id> -t blocks
```

## What Makes This Discovery Tree?

1. **Emergent Structure**: Tree grew through research and discovery
2. **Just-in-Time Breakdown**: Created subtasks when we knew what to build
3. **Visible Pivots**: Closed old tasks show approach change
4. **Ready-to-Work**: Can always run `bd ready` to find next task
5. **Bottom-Up Context**: Any task shows path to root via `bd dep tree`

## Next Steps After Restructuring

1. **Find ready work**:
   ```bash
   bd ready
   ```

2. **Claim first task**:
   ```bash
   bd update <task-id> --status in_progress
   ```

3. **Work and discover**:
   - If task is bigger than expected → break into subtasks
   - If new requirements emerge → add them to tree
   - If get distracted → capture as low-priority task

4. **Complete and continue**:
   ```bash
   bd close <task-id> --reason "Completed"
   bd update <parent-id> --notes "Completed: <what-you-did>"
   ```

5. **Track progress**:
   ```bash
   bd epic status --no-daemon
   ```

## Complete Script

The full implementation is in: `/Users/zell/mcp-servers/bun-sandbox/restructure-discovery-tree.ts`

Run it with:
```bash
./restructure-discovery-tree.ts
```

Or:
```bash
bun run restructure-discovery-tree.ts
```
