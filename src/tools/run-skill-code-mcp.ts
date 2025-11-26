import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runSkillCode } from "./run-skill-code.js";

export const registerRunSkillCodeTool = (server: McpServer): void => {
  server.tool(
    "run-skill-code",
    "Execute TypeScript code in-process with access to ~/.claude/skills APIs",
    {
      code: z
        .string()
        .describe("TypeScript code to execute with top-level await support"),
      description: z
        .string()
        .optional()
        .describe("Short description of what this code does (5-10 words)"),
    },
    async ({ code, description }) => {
      try {
        const result = await runSkillCode({ code, description });

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Error executing code: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );
};
