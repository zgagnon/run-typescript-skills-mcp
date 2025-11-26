import { describe, test, expect } from "bun:test";
import { runSkillCode } from "./run-skill-code";

describe("runSkillCode", () => {
  describe("when using discovery-tree-workflow APIs", () => {
    test("creates a task using discovery tree API", async () => {
      const result = await runSkillCode({
        code: `
          import { setWorkspace, createTask } from '~/.claude/skills/discovery-tree-workflow/src/beads.js';

          await setWorkspace({ workspacePath: process.cwd() });

          const task = await createTask({
            title: "Test task from RunSkillCode",
            type: "task",
            priority: 1
          });

          console.log(\`Created task: \${task.title}\`);
          return task;
        `,
        description: "Test discovery tree integration"
      });

      // Should have created a task and returned it
      expect(result.returnValue).toHaveProperty("id");
      expect(result.returnValue).toHaveProperty("title", "Test task from RunSkillCode");
      expect(result.returnValue).toHaveProperty("taskType", "task");

      // Should have logged the creation
      expect(result.stdout).toContain("Created task: Test task from RunSkillCode");

      // No errors
      expect(result.stderr).toBe("");
    });

    test("queries tasks using findReadyTasks", async () => {
      const result = await runSkillCode({
        code: `
          import { setWorkspace, findReadyTasks } from '~/.claude/skills/discovery-tree-workflow/src/beads.js';

          await setWorkspace({ workspacePath: process.cwd() });

          const tasks = await findReadyTasks({ limit: 5 });

          console.log(\`Found \${tasks.length} ready tasks\`);
          return { count: tasks.length, tasks };
        `,
        description: "Query discovery tree tasks"
      });

      // Should return task data
      expect(result.returnValue).toHaveProperty("count");
      expect(result.returnValue.count).toBeGreaterThanOrEqual(0);
      expect(result.returnValue).toHaveProperty("tasks");
      expect(Array.isArray(result.returnValue.tasks)).toBe(true);

      // Should have logged the count
      expect(result.stdout).toMatch(/Found \d+ ready tasks/);

      // No errors
      expect(result.stderr).toBe("");
    });
  });
});
