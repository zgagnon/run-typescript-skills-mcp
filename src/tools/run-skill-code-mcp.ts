import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runSkillCode } from "./run-skill-code.js";

export const registerRunSkillCodeTool = (server: McpServer): void => {
  server.tool(
    "run-skill-code",
    "Execute TypeScript code in-process with access to ~/.claude/skills APIs. Supports top-level await. IMPORTANT: Use single-line imports only (multi-line imports not supported). Use ~ for ~/.claude/skills paths. Returns {returnValue, stdout, stderr}.",
    {
      code: z
        .string()
        .describe("TypeScript code to execute. IMPORTANT: All import statements must be single-line (e.g., 'import { x, y } from \"path\"'). Supports top-level await. Use 'return' to set returnValue, console.log() for stdout output."),
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
