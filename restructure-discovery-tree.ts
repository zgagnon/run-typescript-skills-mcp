#!/usr/bin/env bun

/**
 * Discovery Tree Restructuring Script
 *
 * Restructures the TypeScript execution tool discovery tree from:
 *   OLD: Fork mcp-bun approach
 *   NEW: Build in-process MCP server plugin
 *
 * This script demonstrates the complete workflow for:
 * 1. Closing obsolete tasks from the forking approach
 * 2. Creating new epic and root task for in-process approach
 * 3. Creating properly structured subtasks
 * 4. Establishing parent-child relationships
 * 5. Migrating still-relevant tasks
 */

import { $ } from "bun";

// Color codes for output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function section(title: string) {
  log(`\n${"=".repeat(60)}`, colors.cyan);
  log(title, colors.cyan);
  log("=".repeat(60), colors.cyan);
}

/**
 * Execute a bd command and return parsed JSON result
 */
async function bd(args: string): Promise<any> {
  const cmd = `bd ${args}`;
  log(`  $ ${cmd}`, colors.yellow);

  const result = await $`bash -c ${cmd}`.text();

  // If --json flag is present, parse the result
  if (args.includes("--json")) {
    try {
      return JSON.parse(result);
    } catch (e) {
      log(`  Warning: Could not parse JSON from: ${result}`, colors.red);
      return { id: null };
    }
  }

  return result;
}

/**
 * Close obsolete tasks from the forking approach
 */
async function closeObsoleteTasks() {
  section("STEP 1: Close Obsolete Tasks");

  const obsoleteTasks = [
    {
      id: "bts-te7",
      title: "Fork mcp-bun repository",
      reason: "No longer needed - building in-process tool instead of forking external MCP server"
    },
    {
      id: "bts-qv1",
      title: "Add temp workspace and auto-cleanup to execute tools",
      reason: "No longer needed - was for modifying forked mcp-bun, now building from scratch"
    }
  ];

  for (const task of obsoleteTasks) {
    log(`\nClosing ${task.id}: ${task.title}`, colors.magenta);
    await bd(`close ${task.id} --reason "${task.reason}"`);
    log(`  ✓ Closed`, colors.green);
  }
}

/**
 * Link root task to epic
 */
async function linkRootToEpic(rootId: string, epicId: string) {
  section("STEP 2: Link Root Task to Epic");

  log(`\nLinking ${rootId} (root) → ${epicId} (epic)`, colors.magenta);
  await bd(`dep add ${rootId} ${epicId} -t parent-child`);
  log(`  ✓ Linked`, colors.green);
}

/**
 * Create subtasks for the in-process approach
 */
async function createSubtasks(rootId: string) {
  section("STEP 3: Create Subtasks for In-Process Implementation");

  const subtasks = [
    {
      title: "Set up MCP plugin project structure",
      description: "Create TypeScript project with MCP SDK dependencies, build configuration, and package.json setup for Claude Code plugin",
      priority: 1,
      type: "task"
    },
    {
      title: "Implement MCP server with stdio transport",
      description: "Build core MCP server infrastructure with stdio communication, tool registration, and request/response handling",
      priority: 1,
      type: "task"
    },
    {
      title: "Implement execute_typescript tool handler",
      description: "Create tool handler that accepts TypeScript code, creates temp workspace, writes files, and executes with Bun",
      priority: 1,
      type: "task"
    },
    {
      title: "Add temp workspace lifecycle management",
      description: "Implement temp directory creation with unique IDs, execution isolation, and guaranteed cleanup on success/failure/timeout",
      priority: 1,
      type: "task"
    },
    {
      title: "Add timeout and resource limits",
      description: "Implement configurable execution timeouts (default 30s), process killing, and resource constraints",
      priority: 2,
      type: "task"
    },
    {
      title: "Add comprehensive error handling",
      description: "Handle TypeScript compilation errors, runtime errors, timeout errors, and filesystem errors with clear error messages",
      priority: 2,
      type: "task"
    }
  ];

  const createdIds: string[] = [];

  for (const task of subtasks) {
    log(`\nCreating: ${task.title}`, colors.magenta);
    const result = await bd(
      `create "${task.title}" -t ${task.type} -p ${task.priority} --description "${task.description}" --json`
    );

    if (result.id) {
      createdIds.push(result.id);
      log(`  ✓ Created ${result.id}`, colors.green);

      // Link to root task
      log(`  Linking ${result.id} → ${rootId} (parent-child)`, colors.blue);
      await bd(`dep add ${result.id} ${rootId} -t parent-child`);
      log(`  ✓ Linked`, colors.green);
    }
  }

  return createdIds;
}

/**
 * Migrate existing configuration and test tasks
 */
async function migrateExistingTasks(rootId: string) {
  section("STEP 4: Migrate Existing Still-Relevant Tasks");

  const tasksToMigrate = [
    {
      id: "bts-jz9",
      title: "Configure Claude Code MCP integration",
      action: "Link to new root"
    },
    {
      id: "bts-kek",
      title: "Test with jj command execution",
      action: "Keep as test task"
    },
    {
      id: "bts-80k",
      title: "Test with beads command execution",
      action: "Keep as test task"
    }
  ];

  // First, we need to remove old dependency relationships
  log("\nCleaning up old dependencies...", colors.magenta);

  // bts-jz9 currently depends on bts-qv1, bts-7bc, bts-6jk
  // We'll remove the bts-qv1 dependency since it's now obsolete
  // (Note: bd doesn't have a dep remove command in the workflow,
  //  but closing bts-qv1 should handle this)

  // Now link bts-jz9 to new root
  log(`\nLinking ${tasksToMigrate[0].id} → ${rootId} (parent-child)`, colors.magenta);
  await bd(`dep add ${tasksToMigrate[0].id} ${rootId} -t parent-child`);
  log(`  ✓ Linked`, colors.green);

  // Test tasks (bts-kek, bts-80k) are already blocked by bts-jz9
  // So they'll naturally be part of the tree
  log("\nTest tasks (bts-kek, bts-80k) remain blocked by bts-jz9", colors.blue);
}

/**
 * Show the updated tree structure
 */
async function showUpdatedTree(epicId: string, rootId: string) {
  section("STEP 5: View Updated Discovery Tree");

  log("\nEpic Status:", colors.magenta);
  await bd("epic status --no-daemon");

  log("\n\nTree from root task:", colors.magenta);
  await bd(`dep tree ${rootId}`);

  log("\n\nReady to work tasks:", colors.magenta);
  await bd("ready");
}

/**
 * Main restructuring workflow
 */
async function main() {
  log("Discovery Tree Restructuring", colors.cyan);
  log("=" .repeat(60), colors.cyan);

  try {
    // IDs from existing tree
    const EXISTING_EPIC_ID = "bts-5vg";
    const EXISTING_ROOT_ID = "bts-m2w";

    // Execute restructuring workflow
    await closeObsoleteTasks();
    await linkRootToEpic(EXISTING_ROOT_ID, EXISTING_EPIC_ID);
    await createSubtasks(EXISTING_ROOT_ID);
    await migrateExistingTasks(EXISTING_ROOT_ID);
    await showUpdatedTree(EXISTING_EPIC_ID, EXISTING_ROOT_ID);

    section("RESTRUCTURING COMPLETE");
    log("\n✓ Discovery tree successfully restructured for in-process approach", colors.green);
    log("\nNext steps:", colors.cyan);
    log("  1. Run: bd ready", colors.blue);
    log("  2. Pick first task (likely: Set up MCP plugin project structure)", colors.blue);
    log("  3. Claim it: bd update <task-id> --status in_progress", colors.blue);
    log("  4. Start building!", colors.blue);

  } catch (error) {
    log(`\n✗ Error during restructuring: ${error}`, colors.red);
    throw error;
  }
}

// Execute if run directly
if (import.meta.main) {
  main();
}

export { main };
