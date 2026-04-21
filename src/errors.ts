/**
 * Error thrown when a MuMuPlayer command fails or produces unexpected output.
 *
 * Contains the full stdout, stderr, and exit code from the failed command
 * for debugging purposes.
 *
 * @example
 * ```ts
 * try {
 *   await mumu.launch(99);
 * } catch (err) {
 *   if (err instanceof MuMuError) {
 *     console.error(`Exit code: ${err.exitCode}`);
 *     console.error(`stderr: ${err.stderr}`);
 *   }
 * }
 * ```
 */
export class MuMuError extends Error {
  /** Standard output captured from the command. */
  readonly stdout: string;

  /** Standard error output captured from the command. */
  readonly stderr: string;

  /** Process exit code returned by MuMuManager.exe. */
  readonly exitCode: number;

  /**
   * @param message - Human-readable description of what went wrong.
   * @param opts - Raw output from the failed command.
   * @param opts.stdout - Captured stdout.
   * @param opts.stderr - Captured stderr.
   * @param opts.exitCode - Process exit code.
   */
  constructor(
    message: string,
    opts: { stdout: string; stderr: string; exitCode: number },
  ) {
    super(message);
    this.name = "MuMuError";
    this.stdout = opts.stdout;
    this.stderr = opts.stderr;
    this.exitCode = opts.exitCode;
  }
}

/**
 * Error thrown when the MuMuPlayer executable cannot be found at the configured path.
 *
 * Typically encountered when {@link MumuPlayer.assertExists} is called and the
 * file does not exist on disk.
 *
 * @example
 * ```ts
 * try {
 *   await mumu.assertExists();
 * } catch (err) {
 *   if (err instanceof MuMuNotFoundError) {
 *     console.error(`Not found at: ${err.path}`);
 *   }
 * }
 * ```
 */
export class MuMuNotFoundError extends Error {
  /** The file path that was checked and not found. */
  readonly path: string;

  /**
   * @param path - The absolute path to MuMuManager.exe that was not found.
   */
  constructor(path: string) {
    super(`MuMuManager executable not found at: ${path}`);
    this.name = "MuMuNotFoundError";
    this.path = path;
  }
}
