import { runSkillCodeImpl } from './run-skill-code-impl';

export interface RunSkillCodeParams {
  code: string;
  description?: string;
}

export interface RunSkillCodeResult {
  returnValue: any;
  stdout: string;
  stderr: string;
}

/**
 * Execute TypeScript code in a sandboxed environment
 *
 * Executes arbitrary TypeScript code with support for imports from ~/.claude/skills,
 * console output capture (stdout/stderr), and return value extraction.
 *
 * @param params - Code execution parameters
 * @returns Execution result with returnValue, stdout, and stderr
 */
export const runSkillCode = async (
  params: RunSkillCodeParams
): Promise<RunSkillCodeResult> => {
  const workingDir = process.cwd();
  return runSkillCodeImpl(params.code, workingDir);
};
