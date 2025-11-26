import { describe, test, expect, mock } from "bun:test";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("registerRunSkillCodeTool", () => {
  describe("when registering the tool", () => {
    test("calls server.tool once with run-skill-code name, TypeScript description, and code schema", async () => {
      // Dynamic import to avoid module resolution issues in test
      const { registerRunSkillCodeTool } = await import("./run-skill-code-mcp");

      const mockServer = {
        tool: mock(() => {})
      } as unknown as McpServer;

      registerRunSkillCodeTool(mockServer);

      expect(mockServer.tool).toHaveBeenCalledTimes(1);
      const [toolName, description, schema] = (mockServer.tool as any).mock.calls[0];

      expect(toolName).toBe("run-skill-code");
      expect(description).toContain("TypeScript");
      expect(schema).toHaveProperty("code");
    });
  });
});
