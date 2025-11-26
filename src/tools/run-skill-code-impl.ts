export interface TypeScriptExecutor {
  execute(code: string, workingDir: string): Promise<{
    returnValue: any;
    stdout: string;
    stderr: string;
  }>;
}

class DefaultTypeScriptExecutor implements TypeScriptExecutor {
  async execute(code: string, workingDir: string) {
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');

    // Create temp file for code execution
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'run-skill-code-'));
    const tmpFile = path.join(tmpDir, 'code.ts');

    try {
      // Get home directory for ~ expansion
      const homeDir = process.env.HOME || os.homedir();

      // Separate imports from code and expand ~ in import paths
      const lines = code.split('\n');
      const imports: string[] = [];
      const codeLines: string[] = [];

      for (const line of lines) {
        if (/^\s*import\s+/.test(line)) {
          // Expand ~ to home directory in import paths
          const expandedLine = line.replace(/['"]~\//g, `'${homeDir}/`);
          imports.push(expandedLine);
        } else {
          codeLines.push(line);
        }
      }

      // Wrap code to capture return value
      const wrappedCode = `
${imports.join('\n')}

(async () => {
  const __result = await (async () => {
    ${codeLines.join('\n')}
  })();

  console.log('__RETURN_VALUE__:' + JSON.stringify(__result));
})();
`;

      await fs.writeFile(tmpFile, wrappedCode);

      // Execute with Bun from working directory
      const proc = Bun.spawn(['bun', 'run', tmpFile], {
        cwd: workingDir,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
          ...process.env,
          // Expand ~ to home directory for imports
          HOME: process.env.HOME || os.homedir()
        }
      });

      const [stdout, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text()
      ]);

      await proc.exited;

      // Parse return value from stdout
      let returnValue = undefined;
      let stdoutClean = stdout;

      const returnMarker = '__RETURN_VALUE__:';
      const returnIndex = stdout.indexOf(returnMarker);
      if (returnIndex !== -1) {
        const returnLine = stdout.slice(returnIndex + returnMarker.length);
        const returnEnd = returnLine.indexOf('\n');
        const returnJson = returnEnd === -1 ? returnLine : returnLine.slice(0, returnEnd);

        try {
          returnValue = JSON.parse(returnJson);
        } catch {
          returnValue = undefined;
        }

        // Remove return value marker from stdout
        stdoutClean = stdout.slice(0, returnIndex) + (returnEnd === -1 ? '' : returnLine.slice(returnEnd + 1));
      }

      return {
        returnValue,
        stdout: stdoutClean,
        stderr
      };
    } finally {
      // Cleanup temp files
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

const defaultExecutor = new DefaultTypeScriptExecutor();

export const runSkillCodeImpl = async (
  code: string,
  workingDir: string,
  executor: TypeScriptExecutor = defaultExecutor
) => {
  return await executor.execute(code, workingDir);
};
