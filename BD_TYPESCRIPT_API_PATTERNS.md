# BD (Beads) TypeScript API Patterns

Complete reference for integrating bd commands in TypeScript scripts for discovery tree automation.

## Core Pattern: Command Wrapper

```typescript
import { $ } from "bun";

/**
 * Execute bd command and parse JSON results
 */
async function bd(args: string): Promise<any> {
  const cmd = `bd ${args}`;

  // Execute via bash to ensure proper shell expansion
  const result = await $`bash -c ${cmd}`.text();

  // Auto-parse JSON responses
  if (args.includes("--json")) {
    try {
      return JSON.parse(result);
    } catch (e) {
      console.error(`Failed to parse JSON: ${result}`);
      return { id: null };
    }
  }

  return result;
}
```

## Task Creation Patterns

### Pattern 1: Simple Task Creation

```typescript
// Minimal task
const result = await bd(`create "Task title" -t task -p 1 --json`);
const taskId = result.id;
```

### Pattern 2: Task with Full Metadata

```typescript
const result = await bd(`
  create "Task title"
  -t task
  -p 1
  --description "Detailed description of what needs to be done"
  --json
`.trim().replace(/\n\s+/g, ' '));

const taskId = result.id;
```

### Pattern 3: Epic Creation

```typescript
const epicResult = await bd(`
  create "Epic: Feature Name"
  -t epic
  -p 1
  --description "High-level feature description"
  --json
`.trim().replace(/\n\s+/g, ' '));

const epicId = epicResult.id;
```

### Pattern 4: Task with Acceptance Criteria

```typescript
const acceptance = "1. Feature works\n2. Tests pass\n3. Documented";

const result = await bd(`
  create "Task title"
  -t task
  -p 1
  --acceptance "${acceptance.replace(/\n/g, '\\n')}"
  --json
`.trim().replace(/\n\s+/g, ' '));
```

### Pattern 5: Batch Task Creation

```typescript
interface TaskSpec {
  title: string;
  description: string;
  priority: number;
  type: "task" | "bug" | "feature" | "epic" | "chore";
}

async function createTasks(specs: TaskSpec[]): Promise<string[]> {
  const ids: string[] = [];

  for (const spec of specs) {
    const result = await bd(`
      create "${spec.title}"
      -t ${spec.type}
      -p ${spec.priority}
      --description "${spec.description}"
      --json
    `.trim().replace(/\n\s+/g, ' '));

    if (result.id) {
      ids.push(result.id);
    }
  }

  return ids;
}

// Usage
const tasks = await createTasks([
  {
    title: "Implement feature A",
    description: "Build the A feature",
    priority: 1,
    type: "task"
  },
  {
    title: "Implement feature B",
    description: "Build the B feature",
    priority: 2,
    type: "task"
  }
]);
```

## Dependency Management Patterns

### Pattern 1: Parent-Child (Hierarchy)

```typescript
// Create parent and children
const parent = await bd(`create "Parent task" -t task -p 1 --json`);
const child1 = await bd(`create "Child task 1" -t task -p 1 --json`);
const child2 = await bd(`create "Child task 2" -t task -p 1 --json`);

// Link children to parent
await bd(`dep add ${child1.id} ${parent.id} -t parent-child`);
await bd(`dep add ${child2.id} ${parent.id} -t parent-child`);
```

### Pattern 2: Blocking Dependencies

```typescript
// Task B blocks Task A (A cannot start until B is done)
const taskA = await bd(`create "Task A" -t task -p 1 --json`);
const taskB = await bd(`create "Task B (prerequisite)" -t task -p 1 --json`);

await bd(`dep add ${taskA.id} ${taskB.id} -t blocks`);
```

### Pattern 3: Related Links

```typescript
// Tasks are related but don't block each other
const task1 = await bd(`create "Task 1" -t task -p 1 --json`);
const task2 = await bd(`create "Task 2" -t task -p 1 --json`);

await bd(`dep add ${task1.id} ${task2.id} -t related`);
```

### Pattern 4: Discovery Dependencies

```typescript
// Task B was discovered while working on Task A
const taskA = await bd(`create "Task A" -t task -p 1 --json`);
const taskB = await bd(`create "Task B (discovered)" -t task -p 1 --json`);

await bd(`dep add ${taskB.id} ${taskA.id} -t discovered-from`);
```

### Pattern 5: Batch Linking to Parent

```typescript
async function linkToParent(childIds: string[], parentId: string) {
  for (const childId of childIds) {
    await bd(`dep add ${childId} ${parentId} -t parent-child`);
  }
}

// Usage
const parent = await bd(`create "Parent" -t task -p 1 --json`);
const children = await createTasks([...taskSpecs]);
await linkToParent(children, parent.id);
```

## Status Management Patterns

### Pattern 1: Claim Work

```typescript
// Mark task as in progress
await bd(`update ${taskId} --status in_progress`);
```

### Pattern 2: Complete Work

```typescript
// Close with reason
await bd(`close ${taskId} --reason "Completed successfully"`);
```

### Pattern 3: Block Task

```typescript
// Mark as blocked with notes
await bd(`update ${taskId} --status blocked`);
await bd(`update ${taskId} --notes "Blocked: waiting for API access"`);
```

### Pattern 4: Reopen Task

```typescript
// Reopen closed task
await bd(`reopen ${taskId} --reason "New requirements emerged"`);
```

### Pattern 5: Update Progress Notes

```typescript
// Add notes about progress
await bd(`update ${taskId} --notes "Completed: API integration. Next: UI work"`);
```

## Query Patterns

### Pattern 1: List All Open Tasks

```typescript
const result = await bd(`list --status open --json`);
const tasks = JSON.parse(result);
```

### Pattern 2: Find Ready-to-Work Tasks

```typescript
const result = await bd(`ready --json`);
const readyTasks = JSON.parse(result);
```

### Pattern 3: Show Task Details

```typescript
const result = await bd(`show ${taskId} --json`);
const task = JSON.parse(result);

console.log(`Title: ${task.title}`);
console.log(`Status: ${task.status}`);
console.log(`Dependencies: ${task.dependencies.length}`);
```

### Pattern 4: View Dependency Tree

```typescript
// Bottom-up tree (task to root)
const tree = await bd(`dep tree ${taskId}`);
console.log(tree); // Already formatted, no JSON
```

### Pattern 5: Check Epic Progress

```typescript
const status = await bd(`epic status --no-daemon`);
console.log(status); // Already formatted, no JSON
```

### Pattern 6: Get Statistics

```typescript
const stats = await bd(`stats --json`);
const data = JSON.parse(stats);

console.log(`Total issues: ${data.total}`);
console.log(`Open: ${data.open}`);
console.log(`In progress: ${data.in_progress}`);
console.log(`Closed: ${data.closed}`);
```

## Discovery Tree Construction Pattern

Complete pattern for building a discovery tree:

```typescript
async function buildDiscoveryTree(
  epicTitle: string,
  rootTitle: string,
  subtasks: TaskSpec[]
) {
  // 1. Create epic
  const epic = await bd(`
    create "${epicTitle}"
    -t epic
    -p 1
    --json
  `.trim().replace(/\n\s+/g, ' '));

  console.log(`Created epic: ${epic.id}`);

  // 2. Create root task
  const root = await bd(`
    create "${rootTitle} [root]"
    -t task
    -p 1
    --json
  `.trim().replace(/\n\s+/g, ' '));

  console.log(`Created root: ${root.id}`);

  // 3. Link root to epic
  await bd(`dep add ${root.id} ${epic.id} -t parent-child`);
  console.log(`Linked root to epic`);

  // 4. Create and link subtasks
  const subtaskIds: string[] = [];

  for (const spec of subtasks) {
    const task = await bd(`
      create "${spec.title}"
      -t ${spec.type}
      -p ${spec.priority}
      --description "${spec.description}"
      --json
    `.trim().replace(/\n\s+/g, ' '));

    subtaskIds.push(task.id);
    console.log(`Created subtask: ${task.id}`);

    // Link to root
    await bd(`dep add ${task.id} ${root.id} -t parent-child`);
    console.log(`Linked ${task.id} to root`);
  }

  return {
    epicId: epic.id,
    rootId: root.id,
    subtaskIds
  };
}

// Usage
const tree = await buildDiscoveryTree(
  "Feature: User Authentication",
  "User Authentication",
  [
    {
      title: "Design auth flow",
      description: "Design the authentication flow and API",
      priority: 1,
      type: "task"
    },
    {
      title: "Implement login endpoint",
      description: "Build /api/login endpoint with validation",
      priority: 1,
      type: "task"
    }
  ]
);
```

## Error Handling Patterns

### Pattern 1: Try-Catch with Logging

```typescript
async function safeBd(args: string): Promise<any> {
  try {
    return await bd(args);
  } catch (error) {
    console.error(`BD command failed: ${args}`);
    console.error(`Error: ${error}`);
    throw error;
  }
}
```

### Pattern 2: Validation Before Creation

```typescript
async function createValidatedTask(spec: TaskSpec): Promise<string | null> {
  // Validate spec
  if (!spec.title || spec.title.length === 0) {
    console.error("Task title cannot be empty");
    return null;
  }

  if (spec.priority < 0 || spec.priority > 5) {
    console.error("Priority must be 0-5");
    return null;
  }

  // Create task
  const result = await bd(`
    create "${spec.title}"
    -t ${spec.type}
    -p ${spec.priority}
    --json
  `.trim().replace(/\n\s+/g, ' '));

  return result.id;
}
```

### Pattern 3: Atomic Create-and-Link

```typescript
async function createAndLinkTask(
  spec: TaskSpec,
  parentId: string
): Promise<string | null> {
  try {
    // Create task
    const result = await bd(`
      create "${spec.title}"
      -t ${spec.type}
      -p ${spec.priority}
      --description "${spec.description}"
      --json
    `.trim().replace(/\n\s+/g, ' '));

    if (!result.id) {
      throw new Error("Task creation returned no ID");
    }

    // Link to parent
    await bd(`dep add ${result.id} ${parentId} -t parent-child`);

    return result.id;

  } catch (error) {
    console.error(`Failed to create and link task: ${spec.title}`);
    console.error(error);
    return null;
  }
}
```

## Utility Functions

### Get All Tasks by Status

```typescript
async function getTasksByStatus(status: string): Promise<any[]> {
  const result = await bd(`list --status ${status} --json`);
  return JSON.parse(result);
}

// Usage
const openTasks = await getTasksByStatus("open");
const inProgressTasks = await getTasksByStatus("in_progress");
```

### Close Multiple Tasks

```typescript
async function closeTasks(taskIds: string[], reason: string) {
  for (const id of taskIds) {
    await bd(`close ${id} --reason "${reason}"`);
    console.log(`Closed ${id}`);
  }
}

// Usage
await closeTasks(
  ["bts-te7", "bts-qv1"],
  "No longer needed - approach changed"
);
```

### Update Parent After Subtask Completion

```typescript
async function updateParentProgress(
  parentId: string,
  completedWork: string
) {
  // Get current notes
  const parent = await bd(`show ${parentId} --json`);
  const currentNotes = JSON.parse(parent).notes || "";

  // Append new completion
  const updatedNotes = currentNotes
    ? `${currentNotes}\n\nCompleted: ${completedWork}`
    : `Completed: ${completedWork}`;

  // Update parent
  await bd(`update ${parentId} --notes "${updatedNotes}"`);
}

// Usage
await updateParentProgress(
  "bts-m2w",
  "Set up project structure with TypeScript and MCP SDK"
);
```

## Complete Example: Restructuring Script

See: `/Users/zell/mcp-servers/bun-sandbox/restructure-discovery-tree.ts`

This script demonstrates:
- Creating epics and root tasks
- Batch task creation with linking
- Closing obsolete tasks
- Migrating existing tasks
- Error handling
- Progress logging
- Final verification
