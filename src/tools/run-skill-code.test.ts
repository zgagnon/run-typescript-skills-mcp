import { describe, test, expect } from "bun:test";
import { runSkillCode } from "./run-skill-code";

describe("RunSkillCode", () => {
  describe("when executing simple code", () => {
    test("executes simple return value", async () => {
      // Wishful thinking: imagine the perfect API
      const result = await runSkillCode({
        code: "return 42;",
        description: "Return simple number"
      });

      expect(result.returnValue).toBe(42);
      expect(result.stdout).toBe("");
      expect(result.stderr).toBe("");
    });
  });

  describe("when using console output", () => {
    test("captures console output", async () => {
      const result = await runSkillCode({
        code: `
        console.log("hello");
        console.log("world");
        return "done";
      `,
        description: "Test console output"
      });

      expect(result.stdout).toBe("hello\nworld\n");
      expect(result.returnValue).toBe("done");
    });
  });

  describe("when importing from skills directory", () => {
    test("imports from skills directory", async () => {
      const result = await runSkillCode({
        code: `
        import { setWorkspace } from '~/.claude/skills/discovery-tree-workflow/src/beads.js';
        return typeof setWorkspace;
      `,
        description: "Test skills import"
      });

      expect(result.returnValue).toBe("function");
      expect(result.stderr).toBe("");
    });
  });

  describe("when code contains errors", () => {
    test("captures syntax errors in stderr", async () => {
      const result = await runSkillCode({
        code: `
        const x = {;
        return x;
      `,
        description: "Test syntax error"
      });

      expect(result.stderr).toContain("error:");
      expect(result.stderr).toContain("Expected");
      expect(result.returnValue).toBeUndefined();
    });

    test("captures runtime errors in stderr", async () => {
      const result = await runSkillCode({
        code: `
        throw new Error("Something went wrong");
      `,
        description: "Test runtime error"
      });

      expect(result.stderr).toContain("error:");
      expect(result.stderr).toContain("Something went wrong");
      expect(result.returnValue).toBeUndefined();
    });
  });

  describe("when using template literals", () => {
    test("supports string interpolation and template literals", async () => {
      const result = await runSkillCode({
        code: `
        const name = "World";
        const greeting = \`Hello \${name}!\`;
        console.log(greeting);
        return greeting;
      `,
        description: "Test template literals"
      });

      expect(result.returnValue).toBe("Hello World!");
      expect(result.stdout).toBe("Hello World!\n");
    });
  });
});
