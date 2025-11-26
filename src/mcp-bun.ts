#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Import tool registration
import { registerRunSkillCodeTool } from "./tools/run-skill-code-mcp.js";

// Read package.json at runtime
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
);

// Create an MCP server
const server = new McpServer({
  name: "Bun",
  version: packageJson.version || "0.0.0-SNAPSHOT",
});

// Register tools
registerRunSkillCodeTool(server);

// Start the server
const main = async (): Promise<void> => {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(
      `Bun MCP Server version ${
        packageJson.version || "0.0.0-SNAPSHOT"
      } running...`
    );
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

main();
