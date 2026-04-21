import { execa } from "execa";
import { access } from "node:fs/promises";
import { MuMuError, MuMuNotFoundError } from "./errors";
import type {
  AppInfoOptions,
  CloneOptions,
  CreateOptions,
  DriverName,
  ExportOptions,
  GpuMode,
  ImportOptions,
  LaunchAndWaitOptions,
  LaunchOptions,
  LayoutWindowOptions,
  LayoutWindowResult,
  MuMuCommandResult,
  MuMuExecResult,
  MumuPlayerConfig,
  MuMuPlayerBaseInfo,
  MuMuPlayerInfo,
  MuMuPlayerRunningInfo,
  MuMuWritableSettings,
  NetworkBridgeConfig,
  PerformanceMode,
  SettingFromFileOptions,
  SettingGetOptions,
  SettingSetMultiOptions,
  SettingSetOptions,
  ShortcutCreateOptions,
  SimulationKey,
  ToolCmdOptions,
  ToolFuncName,
  VmIndex,
  WaitOptions,
} from "./types";

const DEFAULT_MUMU_PATH =
  "C:\\Program Files\\Netease\\MuMuPlayer\\nx_main\\MuMuManager.exe";

function normalizeVmIndex(vmindex: VmIndex): string {
  if (vmindex === "all") return "all";
  if (Array.isArray(vmindex)) return vmindex.join(",");
  return String(vmindex);
}

const SETTING_RANGES: Record<string, { min: number; max: number }> = {
  screen_brightness: { min: 0, max: 100 },
  "resolution_width.custom": { min: 380, max: 4096 },
  "resolution_height.custom": { min: 380, max: 4096 },
  "resolution_dpi.custom": { min: 10, max: 960 },
};

const SETTING_ALLOWED: Record<string, readonly number[]> = {
  "performance_cpu.custom": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  "performance_mem.custom": [0.75, 1, 1.5, 1.75, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  dynamic_low_frame_rate_limit: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
};

const SETTING_ENUMS: Record<string, readonly string[]> = {
  performance_mode: ["low", "middle", "high", "custom"],
  gpu_mode: ["low", "middle", "high", "custom"],
  renderer_mode: ["vk", "gl"],
  net_bridge_ip_mode: ["dhcp", "static"],
  resolution_mode: [
    "tablet.0", "tablet.1", "tablet.2", "tablet.3",
    "phone.0", "phone.1", "phone.2", "phone.3",
    "widescreen.0", "widescreen.1", "widescreen.2", "widescreen.3",
    "custom",
  ],
};

function validateSetting(key: string, value: string): void {
  const range = SETTING_RANGES[key];
  if (range) {
    const num = Number(value);
    if (isNaN(num) || num < range.min || num > range.max) {
      throw new MuMuError(
        `Setting "${key}" must be between ${range.min} and ${range.max}, got ${value}`,
        { stdout: "", stderr: "", exitCode: -1 },
      );
    }
  }

  const allowed = SETTING_ALLOWED[key];
  if (allowed) {
    const num = Number(value);
    if (isNaN(num) || !allowed.includes(num)) {
      throw new MuMuError(
        `Setting "${key}" must be one of [${allowed.join(", ")}], got ${value}`,
        { stdout: "", stderr: "", exitCode: -1 },
      );
    }
  }

  const enumValues = SETTING_ENUMS[key];
  if (enumValues && !enumValues.includes(value)) {
    throw new MuMuError(
      `Setting "${key}" must be one of [${enumValues.map((v) => `"${v}"`).join(", ")}], got "${value}"`,
      { stdout: "", stderr: "", exitCode: -1 },
    );
  }
}

/**
 * TypeScript wrapper for the MuMu Player MuMuManager CLI.
 *
 * Provides type-safe async methods for every MuMuManager subcommand including
 * player lifecycle management, app control, settings, simulation properties,
 * ADB/shell access, and more.
 *
 * @example
 * ```ts
 * import { MumuPlayer } from "mumuplayer";
 *
 * const mumu = new MumuPlayer();
 *
 * // List all players
 * const players = await mumu.getInfo("all");
 *
 * // Launch player 0
 * await mumu.launch(0);
 *
 * // Install an APK on player 0
 * await mumu.appInstall(0, "C:\\path\\to\\app.apk");
 * ```
 */
export class MumuPlayer {
  private readonly mumuPath: string;

  /**
   * Create a new MumuPlayer instance.
   *
   * @param config - Configuration options. See {@link MumuPlayerConfig}.
   */
  constructor(config: MumuPlayerConfig = {}) {
    this.mumuPath = config.mumuPath ?? DEFAULT_MUMU_PATH;
  }

  /**
   * Verify that the MuMuManager.exe executable exists on disk.
   *
   * @throws {@link MuMuNotFoundError} When the executable is not found at the configured path.
   */
  async assertExists(): Promise<void> {
    try {
      await access(this.mumuPath);
    } catch {
      throw new MuMuNotFoundError(this.mumuPath);
    }
  }

  // -----------------------------------------------------------------------
  // Internal exec helper
  // -----------------------------------------------------------------------

  private async exec(
    args: string[],
    options?: { timeout?: number },
  ): Promise<MuMuExecResult> {
    const result = await execa(this.mumuPath, args, {
      reject: false,
      windowsHide: true,
      timeout: options?.timeout,
    });

    return {
      stdout: (result.stdout ?? "").trim(),
      stderr: (result.stderr ?? "").trim(),
      exitCode: result.exitCode ?? -1,
    };
  }

  private async execStdout(args: string[]): Promise<string> {
    const { stdout } = await this.exec(args);
    return stdout;
  }

  private async execCommandResult(args: string[], vmindex?: VmIndex): Promise<MuMuCommandResult[]> {
    const raw = await this.execStdout(args);
    const data = JSON.parse(raw);

    // Single-target responses are flat: { errcode, errmsg }
    if ("errcode" in data) {
      return [{
        index: typeof vmindex === "number" ? vmindex : -1,
        errcode: data.errcode as number,
        errmsg: data.errmsg as string,
      }];
    }

    // Multi-target responses are keyed: { "1": { errcode, errmsg }, "2": { ... } }
    return Object.entries(data).map(([key, result]) => ({
      index: Number(key),
      ...(result as { errcode: number; errmsg: string }),
    }));
  }

  private async poll<T>(
    predicate: () => Promise<T | false>,
    timeout: number,
    interval: number,
  ): Promise<T> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const result = await predicate();
      if (result !== false) return result;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new MuMuError(
      `Timed out after ${timeout}ms`,
      { stdout: "", stderr: "", exitCode: -1 },
    );
  }

  /**
   * Execute an arbitrary MuMuManager.exe command.
   *
   * Escape hatch for advanced users who need to run commands not yet
   * wrapped by the library.
   *
   * @param args - Array of command-line arguments to pass to MuMuManager.exe.
   * @returns The raw exec result with stdout, stderr, and exit code.
   *
   * @example
   * ```ts
   * const result = await mumu.rawExec(["version"]);
   * console.log(result.stdout);
   * ```
   */
  async rawExec(args: string[]): Promise<MuMuExecResult> {
    return this.exec(args);
  }

  // -----------------------------------------------------------------------
  // Top-level commands
  // -----------------------------------------------------------------------

  /**
   * Get the MuMu Player version string.
   *
   * @returns The version string reported by MuMuManager.
   */
  async version(): Promise<string> {
    return this.execStdout(["version"]);
  }

  /**
   * Get player info. Returns an array of {@link MuMuPlayerInfo} objects.
   *
   * When `vmindex` is omitted every player is returned.
   *
   * @param vmindex - Which player(s) to query. Omit to get all.
   * @returns Array of player info objects.
   *
   * @example
   * ```ts
   * // Get info for all players
   * const all = await mumu.getInfo();
   *
   * // Get info for a specific player
   * const [player] = await mumu.getInfo(0);
   * console.log(player.name, player.player_state);
   * ```
   */
  async getInfo(vmindex: VmIndex = "all"): Promise<MuMuPlayerInfo[]> {
    const args = ["info", "--vmindex", normalizeVmIndex(vmindex)];

    const raw = await this.execStdout(args);
    const data = JSON.parse(raw);

    const normalize = (obj: Record<string, unknown>): MuMuPlayerInfo => ({
      ...obj,
      index: Number(obj.index),
    }) as MuMuPlayerInfo;

    // Single-player responses come as a bare object instead of { "0": {...} }
    if ("index" in data) return [normalize(data)];
    return Object.values(data).map((v) => normalize(v as Record<string, unknown>));
  }

  /**
   * Create new player instance(s).
   *
   * @param options - Creation options. See {@link CreateOptions}.
   * @returns Array of results, one per created player, with the assigned index and error status.
   *
   * @example
   * ```ts
   * const results = await mumu.create({ number: 2 });
   * for (const r of results) {
   *   console.log(`Player ${r.index}: ${r.errcode === 0 ? "ok" : r.errmsg}`);
   * }
   * ```
   */
  async create(options: CreateOptions = {}): Promise<MuMuCommandResult[]> {
    const args = ["create"];
    if (options.vmindex !== undefined) {
      args.push("--vmindex", normalizeVmIndex(options.vmindex));
    }
    if (options.number !== undefined) {
      args.push("--number", String(options.number));
    }
    if (options.mini) {
      args.push("--mini");
    }
    return this.execCommandResult(args, options.vmindex);
  }

  /**
   * Clone an existing player.
   *
   * @param vmindex - Index of the player to clone.
   * @param options - Clone options. See {@link CloneOptions}.
   * @returns Array of results, one per cloned player, with the assigned index and error status.
   */
  async clone(vmindex: VmIndex, options: CloneOptions = {}): Promise<MuMuCommandResult[]> {
    if (typeof vmindex === "number") {
      const [info] = await this.getInfo(vmindex);
      if (info.is_process_started) {
        throw new MuMuError(
          `Cannot clone player ${vmindex} while it is running. Shut it down first.`,
          { stdout: "", stderr: "", exitCode: -1 },
        );
      }
    }
    const args = ["clone", "--vmindex", normalizeVmIndex(vmindex)];
    if (options.number !== undefined) {
      args.push("--number", String(options.number));
    }
    return this.execCommandResult(args, vmindex);
  }

  /**
   * Delete player(s) and their data.
   *
   * @param vmindex - Which player(s) to delete.
   * @returns Array of results, one per deleted player, with error status.
   */
  async delete(vmindex: VmIndex): Promise<MuMuCommandResult[]> {
    return this.execCommandResult(["delete", "--vmindex", normalizeVmIndex(vmindex)], vmindex);
  }

  /**
   * Rename a player. The player must be stopped — renaming a running player
   * will not persist the new name.
   *
   * @param vmindex - Which player to rename (single index only).
   * @param name - The new display name.
   * @returns Raw command output.
   * @throws {@link MuMuError} If the player is currently running.
   */
  async rename(vmindex: number, name: string): Promise<string> {
    const [info] = await this.getInfo(vmindex);
    if (info.is_process_started) {
      throw new MuMuError(
        `Cannot rename player ${vmindex} while it is running. Shut it down first.`,
        { stdout: "", stderr: "", exitCode: -1 },
      );
    }
    return this.execStdout([
      "rename",
      "--vmindex",
      String(vmindex),
      "--name",
      name,
    ]);
  }

  /**
   * Import `.mumudata` backup file(s).
   *
   * @param path - Path to the `.mumudata` file.
   * @param options - Import options. See {@link ImportOptions}.
   * @returns Raw command output.
   */
  async importData(
    path: string,
    options: ImportOptions = {},
  ): Promise<string> {
    const args = ["import", "--path", path];
    if (options.number !== undefined) {
      args.push("--number", String(options.number));
    }
    return this.execStdout(args);
  }

  /**
   * Export player(s) as `.mumudata` backup files.
   *
   * @param vmindex - Which player(s) to export.
   * @param options - Export options. See {@link ExportOptions}.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * // Export player 0 as a compressed file
   * await mumu.exportData(0, { dir: "C:\\backups", zip: true });
   * ```
   */
  async exportData(
    vmindex: VmIndex,
    options: ExportOptions = {},
  ): Promise<string> {
    const args = ["export", "--vmindex", normalizeVmIndex(vmindex)];
    if (options.dir !== undefined) {
      args.push("--dir", options.dir);
    }
    if (options.name !== undefined) {
      args.push("--name", options.name);
    }
    if (options.zip) {
      console.warn("[mumuplayer] The --zip export flag is known to fail with error -502 on some MuMu Player versions.");
      args.push("--zip");
    }
    return this.execStdout(args);
  }

  /**
   * Layout/sort all player windows on screen.
   *
   * **Warning:** This command may hang if one or more player windows are
   * minimized when it runs. By default, `ignoreHang` is `true` and the
   * command will be silently killed after 3 seconds to prevent indefinite
   * blocking. Set `ignoreHang` to `false` to wait for the command to
   * complete normally.
   *
   * @param options - Sort options.
   * @param options.ignoreHang - Kill the command after 3s to avoid hangs. Defaults to `true`.
   * @returns Raw command output (may be empty if the command was killed).
   */
  async sort(options: { ignoreHang?: boolean } = {}): Promise<string> {
    const { ignoreHang = true } = options;
    const { stdout } = await this.exec(
      ["sort"],
      ignoreHang ? { timeout: 3000 } : undefined,
    );
    return stdout;
  }

  // -----------------------------------------------------------------------
  // Polling / Wait helpers
  // -----------------------------------------------------------------------

  /**
   * Wait until a player's Android OS has finished booting.
   *
   * Polls {@link getInfo} until `is_android_started` is `true`, then returns
   * the full running info object.
   *
   * @param vmindex - Which player to wait for (single index).
   * @param options - Timeout and polling interval. See {@link WaitOptions}.
   * @returns The running player info once Android has booted.
   * @throws {@link MuMuError} If the timeout is reached before Android boots.
   *
   * @example
   * ```ts
   * await mumu.launch(0);
   * const info = await mumu.waitForBoot(0, { timeout: 60_000 });
   * console.log("Booted!", info.adb_port);
   * ```
   */
  async waitForBoot(
    vmindex: number,
    options: WaitOptions = {},
  ): Promise<MuMuPlayerRunningInfo> {
    const { timeout = 120_000, interval: rawInterval = 2_000 } = options;
    const interval = Math.max(50, rawInterval);
    return this.poll(
      async () => {
        const [info] = await this.getInfo(vmindex);
        if (info.is_process_started && info.is_android_started) {
          return info as MuMuPlayerRunningInfo;
        }
        return false;
      },
      timeout,
      interval,
    );
  }

  /**
   * Wait until a player has fully shut down.
   *
   * Polls {@link getInfo} until `is_process_started` is `false`.
   *
   * @param vmindex - Which player to wait for (single index).
   * @param options - Timeout and polling interval. See {@link WaitOptions}.
   * @throws {@link MuMuError} If the timeout is reached before shutdown completes.
   *
   * @example
   * ```ts
   * await mumu.shutdown(0);
   * await mumu.waitForShutdown(0);
   * console.log("Player 0 is fully stopped.");
   * ```
   */
  async waitForShutdown(
    vmindex: number,
    options: WaitOptions = {},
  ): Promise<void> {
    const { timeout = 120_000, interval = 2_000 } = options;
    await this.poll(
      async () => {
        const [info] = await this.getInfo(vmindex);
        return !info.is_process_started || false;
      },
      timeout,
      interval,
    );
  }

  /**
   * Launch a player and wait until Android has finished booting.
   *
   * Combines {@link launch} and {@link waitForBoot} into a single call.
   *
   * @param vmindex - Which player to launch (single index).
   * @param options - Launch options plus timeout/interval. See {@link LaunchAndWaitOptions}.
   * @returns The running player info once Android has booted.
   *
   * @example
   * ```ts
   * const info = await mumu.launchAndWait(0, {
   *   package: "com.example.app",
   *   timeout: 90_000,
   * });
   * console.log(`Player 0 ready on ADB port ${info.adb_port}`);
   * ```
   */
  async launchAndWait(
    vmindex: number,
    options: LaunchAndWaitOptions = {},
  ): Promise<MuMuPlayerRunningInfo> {
    const { timeout, interval, ...launchOpts } = options;
    await this.launch(vmindex, launchOpts);
    return this.waitForBoot(vmindex, { timeout, interval });
  }

  /**
   * Restart a player and wait until Android has finished booting.
   *
   * Combines {@link restart} and {@link waitForBoot} into a single call.
   *
   * @param vmindex - Which player to restart (single index).
   * @param options - Timeout and polling interval. See {@link WaitOptions}.
   * @returns The running player info once Android has booted.
   *
   * @example
   * ```ts
   * const info = await mumu.restartAndWait(0);
   * console.log("Restarted and ready!");
   * ```
   */
  async restartAndWait(
    vmindex: number,
    options: WaitOptions = {},
  ): Promise<MuMuPlayerRunningInfo> {
    await this.restart(vmindex);
    return this.waitForBoot(vmindex, options);
  }

  // -----------------------------------------------------------------------
  // State query helpers
  // -----------------------------------------------------------------------

  /**
   * Check if a player's process is currently running.
   *
   * @param vmindex - Which player to check.
   * @returns `true` if the player process is running, `false` otherwise.
   *
   * @example
   * ```ts
   * if (await mumu.isRunning(0)) {
   *   console.log("Player 0 is running");
   * }
   * ```
   */
  async isRunning(vmindex: number): Promise<boolean> {
    const [info] = await this.getInfo(vmindex);
    return info.is_process_started;
  }

  /**
   * Check if a player's Android OS has finished booting.
   *
   * @param vmindex - Which player to check.
   * @returns `true` if Android has booted, `false` otherwise.
   *
   * @example
   * ```ts
   * if (await mumu.isAndroidReady(0)) {
   *   console.log("Android is booted on player 0");
   * }
   * ```
   */
  async isAndroidReady(vmindex: number): Promise<boolean> {
    const [info] = await this.getInfo(vmindex);
    return info.is_android_started;
  }

  /**
   * Get all currently running player instances.
   *
   * @returns Array of running player info objects.
   *
   * @example
   * ```ts
   * const running = await mumu.getRunningPlayers();
   * console.log(`${running.length} players are running`);
   * ```
   */
  async getRunningPlayers(): Promise<MuMuPlayerRunningInfo[]> {
    const all = await this.getInfo("all");
    return all.filter(
      (p): p is MuMuPlayerRunningInfo => p.is_process_started,
    );
  }

  /**
   * Get all currently stopped player instances.
   *
   * @returns Array of stopped player info objects.
   *
   * @example
   * ```ts
   * const stopped = await mumu.getStoppedPlayers();
   * console.log(`${stopped.length} players are stopped`);
   * ```
   */
  async getStoppedPlayers(): Promise<MuMuPlayerBaseInfo[]> {
    const all = await this.getInfo("all");
    return all.filter(
      (p): p is MuMuPlayerBaseInfo => !p.is_process_started,
    );
  }

  /**
   * Find a player by its display name.
   *
   * @param name - The display name to search for.
   * @returns The first matching player, or `undefined` if none found.
   *
   * @example
   * ```ts
   * const player = await mumu.getPlayerByName("My Player");
   * if (player) {
   *   console.log(`Found at index ${player.index}`);
   * }
   * ```
   */
  async getPlayerByName(name: string): Promise<MuMuPlayerInfo | undefined> {
    const all = await this.getInfo("all");
    return all.find((p) => p.name === name);
  }

  /**
   * Get the total number of player instances.
   *
   * @returns The count of all player instances (running and stopped).
   *
   * @example
   * ```ts
   * const count = await mumu.getPlayerCount();
   * console.log(`${count} total players`);
   * ```
   */
  async getPlayerCount(): Promise<number> {
    const all = await this.getInfo("all");
    return all.length;
  }

  // -----------------------------------------------------------------------
  // Control commands
  // -----------------------------------------------------------------------

  /**
   * Launch player(s), optionally auto-launching an app by package name.
   *
   * @param vmindex - Which player(s) to launch.
   * @param options - Launch options. See {@link LaunchOptions}.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * // Launch player 0
   * await mumu.launch(0);
   *
   * // Launch player 1 and auto-start an app
   * await mumu.launch(1, { package: "com.example.app" });
   *
   * // Launch all players
   * await mumu.launch("all");
   * ```
   */
  async launch(
    vmindex: VmIndex,
    options: LaunchOptions = {},
  ): Promise<MuMuCommandResult[]> {
    const args = [
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "launch",
    ];
    if (options.package) {
      args.push("--package", options.package);
    }
    return this.execCommandResult(args, vmindex);
  }

  /**
   * Shutdown player(s).
   *
   * @param vmindex - Which player(s) to shut down.
   * @returns Array of results with error status per player.
   */
  async shutdown(vmindex: VmIndex): Promise<MuMuCommandResult[]> {
    return this.execCommandResult([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "shutdown",
    ], vmindex);
  }

  /**
   * Restart player(s).
   *
   * @param vmindex - Which player(s) to restart.
   * @returns Array of results with error status per player.
   */
  async restart(vmindex: VmIndex): Promise<MuMuCommandResult[]> {
    return this.execCommandResult([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "restart",
    ], vmindex);
  }

  /**
   * Bring a player window back from the background to the foreground.
   *
   * The player must be running. This restores a window that was previously
   * sent to the background via {@link hideWindow}.
   *
   * @param vmindex - Which player to show (single index only).
   * @returns Result with error status.
   * @throws {@link MuMuError} If the player is not running.
   */
  async showWindow(vmindex: number): Promise<MuMuCommandResult[]> {
    const [info] = await this.getInfo(vmindex);
    if (!info.is_process_started) {
      throw new MuMuError(
        `Cannot show player ${vmindex} because it is not running.`,
        { stdout: "", stderr: "", exitCode: -1 },
      );
    }
    return this.execCommandResult([
      "control",
      "--vmindex",
      String(vmindex),
      "show_window",
    ], vmindex);
  }

  /**
   * Send a player window to the background (completely hidden, not just minimized).
   *
   * The player must be running. Use {@link showWindow} to bring it back.
   *
   * @param vmindex - Which player to hide (single index only).
   * @returns Result with error status.
   * @throws {@link MuMuError} If the player is not running.
   */
  async hideWindow(vmindex: number): Promise<MuMuCommandResult[]> {
    const [info] = await this.getInfo(vmindex);
    if (!info.is_process_started) {
      throw new MuMuError(
        `Cannot hide player ${vmindex} because it is not running.`,
        { stdout: "", stderr: "", exitCode: -1 },
      );
    }
    return this.execCommandResult([
      "control",
      "--vmindex",
      String(vmindex),
      "hide_window",
    ], vmindex);
  }

  /**
   * Position and resize a player window.
   *
   * @param vmindex - Which player(s) to reposition.
   * @param options - Window layout options. See {@link LayoutWindowOptions}.
   * @returns The applied window position and size. See {@link LayoutWindowResult}.
   *
   * @example
   * ```ts
   * await mumu.layoutWindow(0, {
   *   posX: 100,
   *   posY: 100,
   *   sizeW: 800,
   *   sizeH: 600,
   * });
   * ```
   */
  async layoutWindow(
    vmindex: VmIndex,
    options: LayoutWindowOptions = {},
  ): Promise<LayoutWindowResult> {
    const args = [
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "layout_window",
    ];
    if (options.posX !== undefined) args.push("--pos_x", String(options.posX));
    if (options.posY !== undefined) args.push("--pos_y", String(options.posY));
    if (options.sizeW !== undefined)
      args.push("--size_w", String(options.sizeW));
    if (options.sizeH !== undefined)
      args.push("--size_h", String(options.sizeH));
    const raw = await this.execStdout(args);
    return JSON.parse(raw) as LayoutWindowResult;
  }

  // -----------------------------------------------------------------------
  // Control > App commands
  // -----------------------------------------------------------------------

  /**
   * Install an APK/APKS/XAPK file on player(s).
   *
   * @param vmindex - Which player(s) to install the app on.
   * @param apkPath - Local file path to the `.apk`, `.apks`, or `.xapk` file.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.appInstall(0, "C:\\Downloads\\myapp.apk");
   * ```
   */
  async appInstall(vmindex: VmIndex, apkPath: string): Promise<string> {
    return this.execStdout([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "app",
      "install",
      "--apk",
      apkPath,
    ]);
  }

  /**
   * Uninstall an app by its package bundle ID.
   *
   * @param vmindex - Which player(s) to uninstall from.
   * @param packageId - The app's package bundle ID (e.g. `"com.example.app"`).
   * @returns Raw command output.
   */
  async appUninstall(vmindex: VmIndex, packageId: string): Promise<string> {
    return this.execStdout([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "app",
      "uninstall",
      "--package",
      packageId,
    ]);
  }

  /**
   * Launch an app by its package bundle ID inside player(s).
   *
   * @param vmindex - Which player(s) to launch the app on.
   * @param packageId - The app's package bundle ID.
   * @returns Raw command output.
   */
  async appLaunch(vmindex: VmIndex, packageId: string): Promise<string> {
    return this.execStdout([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "app",
      "launch",
      "--package",
      packageId,
    ]);
  }

  /**
   * Close (force-stop) an app by its package bundle ID.
   *
   * @param vmindex - Which player(s) to close the app on.
   * @param packageId - The app's package bundle ID.
   * @returns Raw command output.
   */
  async appClose(vmindex: VmIndex, packageId: string): Promise<string> {
    return this.execStdout([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "app",
      "close",
      "--package",
      packageId,
    ]);
  }

  /**
   * Query app state on a player (raw JSON).
   *
   * Note: `--package` returns `"running"` or `"not_installed"` (which really
   * means "not currently running" — it does **not** indicate whether the app
   * is installed). For convenience, use {@link isAppInstalled} for a reliable
   * installation check, {@link isAppRunning} for a boolean running check, or
   * {@link getForegroundApp} to get the active app.
   *
   * @param vmindex - Which player(s) to query.
   * @param options - Query options. See {@link AppInfoOptions}.
   * @returns JSON string with app state.
   *
   * @example
   * ```ts
   * // Get the currently active (foreground) app
   * const result = await mumu.appInfo(0, { installed: true });
   * // => '{ "active": "com.example.app" }'
   *
   * // Check if a specific app is running
   * const result = await mumu.appInfo(0, { package: "com.example.app" });
   * // => '{ "state": "running" }' or '{ "state": "not_installed" }'
   * ```
   */
  async appInfo(
    vmindex: VmIndex,
    options: AppInfoOptions = {},
  ): Promise<string> {
    const args = [
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "app",
      "info",
    ];
    if (options.package) args.push("--package", options.package);
    if (options.installed) args.push("--installed");
    return this.execStdout(args);
  }

  /**
   * Check if an app is installed on a player.
   *
   * Uses `pm path` via shell for a reliable result, unlike {@link appInfo}
   * which conflates "not running" with "not installed."
   *
   * @param vmindex - Which player to check (must be a single running player).
   * @param packageId - The app's package bundle ID.
   * @returns `true` if the app is installed, `false` otherwise.
   *
   * @example
   * ```ts
   * if (await mumu.isAppInstalled(0, "com.android.vending")) {
   *   console.log("Play Store is installed");
   * }
   * ```
   */
  async isAppInstalled(vmindex: number, packageId: string): Promise<boolean> {
    const result = await this.shell(vmindex, `pm path ${packageId}`);
    return result.startsWith("package:");
  }

  /**
   * List all installed app package IDs on a player.
   *
   * Uses `pm list packages` via shell for a complete and reliable list.
   *
   * @param vmindex - Which player to query (must be a single running player).
   * @returns Array of package ID strings.
   *
   * @example
   * ```ts
   * const apps = await mumu.listInstalledApps(0);
   * console.log(apps); // ["com.android.vending", "com.android.settings", ...]
   * ```
   */
  async listInstalledApps(vmindex: number): Promise<string[]> {
    const result = await this.shell(vmindex, "pm list packages");
    return result
      .split("\n")
      .map((line) => line.replace("package:", "").trim())
      .filter(Boolean);
  }

  // -----------------------------------------------------------------------
  // Control > Tool commands
  // -----------------------------------------------------------------------

  /**
   * Trigger a toolbar function on player(s).
   *
   * @param vmindex - Which player(s) to target.
   * @param name - The toolbar function name. See {@link ToolFuncName} for valid values.
   * @returns Result with error status.
   *
   * @example
   * ```ts
   * // Take a screenshot
   * await mumu.toolFunc(0, "screenshot");
   *
   * // Rotate the screen
   * await mumu.toolFunc(0, "rotate");
   *
   * // Go home
   * await mumu.toolFunc(0, "go_home");
   * ```
   */
  async toolFunc(vmindex: VmIndex, name: ToolFuncName): Promise<MuMuCommandResult[]> {
    return this.execCommandResult([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "tool",
      "func",
      "--name",
      name,
    ], vmindex);
  }

  /**
   * Run a toolbar command for input simulation (tap, swipe, long press, text input).
   *
   * @param vmindex - Which player(s) to target.
   * @param options - Command options. See {@link ToolCmdOptions}.
   * @returns Raw command output.
   *
   * **Note:** MuMuManager requires `cmd` to be present. Passing only
   * `text` without `cmd` will result in an error from MuMuManager.
   *
   * @example
   * ```ts
   * // Tap at (400, 300)
   * await mumu.toolCmd(0, { cmd: "input tap 400 300" });
   *
   * // Type text into the focused field
   * await mumu.toolCmd(0, { cmd: "input_text", text: "hello" });
   *
   * // Press the back button
   * await mumu.toolCmd(0, { cmd: "input keyevent 4" });
   * ```
   */
  async toolCmd(
    vmindex: VmIndex,
    options: ToolCmdOptions,
  ): Promise<string> {
    const args = [
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "tool",
      "cmd",
    ];
    if (options.text !== undefined) args.push("--text", options.text);
    if (options.cmd !== undefined) args.push("--cmd", options.cmd);
    return this.execStdout(args);
  }

  /**
   * Set the CPU execution cap for player(s).
   *
   * @param vmindex - Which player(s) to throttle.
   * @param cap - CPU cap percentage, must be between 1 and 100.
   * @returns Result with error status per player.
   */
  async toolDowncpu(vmindex: VmIndex, cap: number): Promise<MuMuCommandResult[]> {
    return this.execCommandResult([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "tool",
      "downcpu",
      "--cap",
      String(cap),
    ], vmindex);
  }

  /**
   * Set the GPS location for player(s).
   *
   * @param vmindex - Which player(s) to update.
   * @param longitude - Longitude in degrees, range `[-180, 180]`.
   * @param latitude - Latitude in degrees, range `[-90, 90]`.
   * @returns Result with error status per player.
   *
   * @example
   * ```ts
   * // Set location to San Francisco
   * await mumu.toolLocation(0, -122.4194, 37.7749);
   * ```
   */
  async toolLocation(
    vmindex: VmIndex,
    longitude: number,
    latitude: number,
  ): Promise<MuMuCommandResult[]> {
    return this.execCommandResult([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "tool",
      "location",
      "--longitude",
      String(longitude),
      "--latitude",
      String(latitude),
    ], vmindex);
  }

  /**
   * Set the gravity sensor (gyroscope) values for player(s).
   *
   * @param vmindex - Which player(s) to update.
   * @param x - X-axis gravity value.
   * @param y - Y-axis gravity value.
   * @param z - Z-axis gravity value.
   * @returns Result with error status per player.
   */
  async toolGyro(
    vmindex: VmIndex,
    x: number,
    y: number,
    z: number,
  ): Promise<MuMuCommandResult[]> {
    return this.execCommandResult([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "tool",
      "gyro",
      "--gyro_x",
      String(x),
      "--gyro_y",
      String(y),
      "--gyro_z",
      String(z),
    ], vmindex);
  }

  // -----------------------------------------------------------------------
  // Input simulation helpers
  // -----------------------------------------------------------------------

  /**
   * Tap at a screen coordinate.
   *
   * @param vmindex - Which player(s) to target.
   * @param x - X coordinate in pixels.
   * @param y - Y coordinate in pixels.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.tap(0, 400, 300);
   * ```
   */
  async tap(vmindex: VmIndex, x: number, y: number): Promise<string> {
    return this.toolCmd(vmindex, { cmd: `input tap ${x} ${y}` });
  }

  /**
   * Perform a swipe gesture.
   *
   * @param vmindex - Which player(s) to target.
   * @param x1 - Start X coordinate.
   * @param y1 - Start Y coordinate.
   * @param x2 - End X coordinate.
   * @param y2 - End Y coordinate.
   * @param durationMs - Swipe duration in milliseconds. Defaults to 300.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * // Swipe right
   * await mumu.swipe(0, 100, 500, 600, 500, 200);
   * ```
   */
  async swipe(
    vmindex: VmIndex,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    durationMs: number = 300,
  ): Promise<string> {
    return this.toolCmd(vmindex, {
      cmd: `input swipe ${x1} ${y1} ${x2} ${y2} ${durationMs}`,
    });
  }

  /**
   * Perform a long press at a screen coordinate.
   *
   * Implemented as a swipe from the same point to the same point.
   *
   * @param vmindex - Which player(s) to target.
   * @param x - X coordinate in pixels.
   * @param y - Y coordinate in pixels.
   * @param durationMs - Hold duration in milliseconds. Defaults to 1000.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.longPress(0, 400, 300, 2000);
   * ```
   */
  async longPress(
    vmindex: VmIndex,
    x: number,
    y: number,
    durationMs: number = 1000,
  ): Promise<string> {
    return this.toolCmd(vmindex, {
      cmd: `input swipe ${x} ${y} ${x} ${y} ${durationMs}`,
    });
  }

  /**
   * Type text into the currently focused input field.
   *
   * @param vmindex - Which player(s) to target.
   * @param text - The text to type.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.inputText(0, "hello world");
   * ```
   */
  async inputText(vmindex: VmIndex, text: string): Promise<string> {
    return this.toolCmd(vmindex, { cmd: "input_text", text });
  }

  /**
   * Send a key event by its Android keycode.
   *
   * @param vmindex - Which player(s) to target.
   * @param keyCode - Android key event code (e.g. `4` for back, `3` for home).
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * // Press the back button (keycode 4)
   * await mumu.keyEvent(0, 4);
   * ```
   */
  async keyEvent(vmindex: VmIndex, keyCode: number): Promise<string> {
    return this.toolCmd(vmindex, { cmd: `input keyevent ${keyCode}` });
  }

  /**
   * Press the Android back button.
   *
   * @param vmindex - Which player(s) to target.
   * @returns Raw command output.
   */
  async pressBack(vmindex: VmIndex): Promise<string> {
    return this.keyEvent(vmindex, 4);
  }

  /**
   * Press the Android home button.
   *
   * @param vmindex - Which player(s) to target.
   * @returns Result with error status.
   */
  async pressHome(vmindex: VmIndex): Promise<MuMuCommandResult[]> {
    return this.toolFunc(vmindex, "go_home");
  }

  // -----------------------------------------------------------------------
  // Control > Shortcut commands
  // -----------------------------------------------------------------------

  /**
   * Create a desktop shortcut for a player.
   *
   * @param vmindex - Which player(s) to create a shortcut for.
   * @param options - Shortcut options. See {@link ShortcutCreateOptions}.
   * @returns Result with error status per player.
   */
  async shortcutCreate(
    vmindex: VmIndex,
    options: ShortcutCreateOptions = {},
  ): Promise<MuMuCommandResult[]> {
    const args = [
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "shortcut",
      "create",
    ];
    if (options.name) args.push("--name", options.name);
    if (options.icon) args.push("--icon", options.icon);
    if (options.package) args.push("--package", options.package);
    return this.execCommandResult(args, vmindex);
  }

  /**
   * Delete the desktop shortcut for a player.
   *
   * @param vmindex - Which player(s) to remove shortcuts for.
   * @returns Result with error status per player.
   */
  async shortcutDelete(vmindex: VmIndex): Promise<MuMuCommandResult[]> {
    return this.execCommandResult([
      "control",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "shortcut",
      "delete",
    ], vmindex);
  }

  // -----------------------------------------------------------------------
  // ADB / Shell
  // -----------------------------------------------------------------------

  /**
   * Run an ADB command against player(s).
   *
   * Supports built-in shortcuts: `connect`, `disconnect`, `getprop`, `setprop`,
   * `input_text`, and keyevents (`go_back`, `go_home`, `go_task`, `key_delete`,
   * `key_enter`, `key_space`, `volume_up`, `volume_down`, `volume_mute`).
   *
   * @param vmindex - Which player(s) to target.
   * @param cmd - The ADB command string.
   * @returns Command output.
   *
   * @example
   * ```ts
   * // Connect ADB
   * await mumu.adb(0, "connect");
   *
   * // Get a system property
   * const version = await mumu.adb(0, "getprop ro.build.version.sdk");
   * ```
   */
  async adb(vmindex: VmIndex, cmd: string): Promise<string> {
    return this.execStdout([
      "adb",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "--cmd",
      cmd,
    ]);
  }

  /**
   * Run a shell command inside the player's Android OS.
   *
   * Supports the same built-in shortcuts as {@link adb}: `getprop`, `setprop`,
   * `input_text`, and keyevents.
   *
   * @param vmindex - Which player(s) to target.
   * @param cmd - The shell command string.
   * @returns Command output.
   *
   * @example
   * ```ts
   * const sdk = await mumu.shell(0, "getprop ro.build.version.sdk");
   * ```
   */
  async shell(vmindex: VmIndex, cmd: string): Promise<string> {
    return this.execStdout([
      "sh",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "--cmd",
      cmd,
    ]);
  }

  // -----------------------------------------------------------------------
  // ADB / Shell convenience
  // -----------------------------------------------------------------------

  /**
   * Get the ADB serial string (`host:port`) for a running player.
   *
   * Useful for connecting external ADB tools to the player.
   *
   * @param vmindex - Which player to query (must be running).
   * @returns ADB serial string (e.g. `"127.0.0.1:16384"`).
   * @throws {@link MuMuError} If the player is not running.
   *
   * @example
   * ```ts
   * const serial = await mumu.getAdbSerial(0);
   * console.log(serial); // "127.0.0.1:16384"
   * ```
   */
  async getAdbSerial(vmindex: number): Promise<string> {
    const [info] = await this.getInfo(vmindex);
    if (!info.is_process_started) {
      throw new MuMuError(
        `Cannot get ADB serial for player ${vmindex} because it is not running.`,
        { stdout: "", stderr: "", exitCode: -1 },
      );
    }
    return `${(info as MuMuPlayerRunningInfo).adb_host_ip}:${(info as MuMuPlayerRunningInfo).adb_port}`;
  }

  /**
   * Connect ADB to player(s).
   *
   * @param vmindex - Which player(s) to connect.
   * @returns Command output.
   */
  async connectAdb(vmindex: VmIndex): Promise<string> {
    return this.adb(vmindex, "connect");
  }

  /**
   * Disconnect ADB from player(s).
   *
   * @param vmindex - Which player(s) to disconnect.
   * @returns Command output.
   */
  async disconnectAdb(vmindex: VmIndex): Promise<string> {
    return this.adb(vmindex, "disconnect");
  }

  /**
   * Get an Android system property.
   *
   * @param vmindex - Which player(s) to query.
   * @param prop - The property name (e.g. `"ro.build.version.sdk"`).
   * @returns The property value.
   *
   * @example
   * ```ts
   * const sdk = await mumu.getProp(0, "ro.build.version.sdk");
   * console.log(sdk); // "33"
   * ```
   */
  async getProp(vmindex: VmIndex, prop: string): Promise<string> {
    return this.shell(vmindex, `getprop ${prop}`);
  }

  /**
   * Set an Android system property.
   *
   * @param vmindex - Which player(s) to update.
   * @param prop - The property name.
   * @param value - The value to set.
   * @returns Command output.
   *
   * @example
   * ```ts
   * await mumu.setProp(0, "debug.layout", "true");
   * ```
   */
  async setProp(vmindex: VmIndex, prop: string, value: string): Promise<string> {
    return this.shell(vmindex, `setprop ${prop} ${value}`);
  }

  /**
   * Push a file from the host to the player's filesystem via ADB.
   *
   * @param vmindex - Which player to push to (single index).
   * @param localPath - Host file path.
   * @param remotePath - Destination path inside the player.
   * @returns Command output.
   *
   * @example
   * ```ts
   * await mumu.pushFile(0, "C:\\data\\config.json", "/sdcard/config.json");
   * ```
   */
  async pushFile(vmindex: number, localPath: string, remotePath: string): Promise<string> {
    return this.adb(vmindex, `push ${localPath} ${remotePath}`);
  }

  /**
   * Pull a file from the player's filesystem to the host via ADB.
   *
   * @param vmindex - Which player to pull from (single index).
   * @param remotePath - Source path inside the player.
   * @param localPath - Destination host file path.
   * @returns Command output.
   *
   * @example
   * ```ts
   * await mumu.pullFile(0, "/sdcard/screenshot.png", "C:\\screenshots\\shot.png");
   * ```
   */
  async pullFile(vmindex: number, remotePath: string, localPath: string): Promise<string> {
    return this.adb(vmindex, `pull ${remotePath} ${localPath}`);
  }

  // -----------------------------------------------------------------------
  // App management extras
  // -----------------------------------------------------------------------

  /**
   * Check if an app is currently running (in the foreground or background).
   *
   * @param vmindex - Which player to query.
   * @param packageId - The app's package bundle ID.
   * @returns `true` if the app is running, `false` otherwise.
   *
   * @example
   * ```ts
   * if (await mumu.isAppRunning(0, "com.example.app")) {
   *   console.log("App is running");
   * }
   * ```
   */
  async isAppRunning(vmindex: VmIndex, packageId: string): Promise<boolean> {
    const raw = await this.appInfo(vmindex, { package: packageId });
    try {
      const data = JSON.parse(raw);
      return data.state === "running";
    } catch {
      return false;
    }
  }

  /**
   * Get the package ID of the currently active (foreground) app.
   *
   * @param vmindex - Which player to query.
   * @returns The foreground app's package ID, or `null` if it cannot be determined.
   *
   * @example
   * ```ts
   * const fg = await mumu.getForegroundApp(0);
   * console.log(fg); // "com.android.launcher3"
   * ```
   */
  async getForegroundApp(vmindex: VmIndex): Promise<string | null> {
    const raw = await this.appInfo(vmindex, { installed: true });
    try {
      const data = JSON.parse(raw);
      return (data.active as string) ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Restart an app by closing and relaunching it.
   *
   * @param vmindex - Which player(s) to target.
   * @param packageId - The app's package bundle ID.
   *
   * @example
   * ```ts
   * await mumu.appRestart(0, "com.example.app");
   * ```
   */
  async appRestart(vmindex: VmIndex, packageId: string): Promise<void> {
    await this.appClose(vmindex, packageId);
    await this.appLaunch(vmindex, packageId);
  }

  // -----------------------------------------------------------------------
  // Settings
  // -----------------------------------------------------------------------

  /**
   * Read player settings.
   *
   * Returns the raw JSON string from MuMuManager. The caller can `JSON.parse()`
   * the result to work with the data programmatically.
   *
   * @param options - Query options. See {@link SettingGetOptions}.
   * @returns JSON string of settings.
   *
   * @example
   * ```ts
   * // Get all writable settings for player 0
   * const raw = await mumu.getSetting({ vmindex: 0, allWritable: true });
   * const settings = JSON.parse(raw);
   * console.log(settings.max_frame_rate); // "60"
   * ```
   */
  async getSetting(options: SettingGetOptions = {}): Promise<string> {
    const args = ["setting"];

    if (options.vmindex !== undefined) {
      args.push("--vmindex", normalizeVmIndex(options.vmindex));
    }

    if (options.key !== undefined) {
      const keys = Array.isArray(options.key) ? options.key : [options.key];
      for (const k of keys) {
        args.push("--key", k);
      }
    }

    if (options.all) args.push("--all");
    if (options.allWritable) args.push("--all_writable");
    if (options.info) args.push("--info");

    return this.execStdout(args);
  }

  /**
   * Set a single setting key-value pair.
   *
   * @param options - The key, value, and optional vmindex. See {@link SettingSetOptions}.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setSetting({
   *   vmindex: 0,
   *   key: "max_frame_rate",
   *   value: "120",
   * });
   * ```
   */
  async setSetting(options: SettingSetOptions): Promise<string> {
    validateSetting(options.key, options.value);

    const args = ["setting"];

    if (options.vmindex !== undefined) {
      args.push("--vmindex", normalizeVmIndex(options.vmindex));
    }

    args.push("--key", options.key, "--value", options.value);
    return this.execStdout(args);
  }

  /**
   * Set multiple setting key-value pairs in one call.
   *
   * Validates each entry before sending the command.
   *
   * @param options - The entries array and optional vmindex. See {@link SettingSetMultiOptions}.
   * @returns Raw command output.
   */
  async setSettingMulti(options: SettingSetMultiOptions): Promise<string> {
    for (const entry of options.entries) {
      validateSetting(entry.key, entry.value);
    }

    const args = ["setting"];

    if (options.vmindex !== undefined) {
      args.push("--vmindex", normalizeVmIndex(options.vmindex));
    }

    for (const entry of options.entries) {
      args.push("--key", entry.key, "--value", entry.value);
    }

    return this.execStdout(args);
  }

  /**
   * Apply settings from a JSON file.
   *
   * @param options - The file path and optional vmindex. See {@link SettingFromFileOptions}.
   * @returns Raw command output.
   */
  async setSettingFromFile(options: SettingFromFileOptions): Promise<string> {
    const args = ["setting"];

    if (options.vmindex !== undefined) {
      args.push("--vmindex", normalizeVmIndex(options.vmindex));
    }

    args.push("--path", options.path);
    return this.execStdout(args);
  }

  // -----------------------------------------------------------------------
  // Settings > Typed convenience methods
  // -----------------------------------------------------------------------

  /**
   * Get all writable settings for a player as a typed object.
   *
   * Values are coerced from strings to their proper types (booleans, numbers).
   *
   * @param vmindex - Which player to query.
   * @returns Typed settings object. See {@link MuMuWritableSettings}.
   *
   * @example
   * ```ts
   * const settings = await mumu.getSettings(0);
   * console.log(settings.max_frame_rate); // 60
   * console.log(settings.performance_mode); // "middle"
   * console.log(settings.force_discrete_graphics); // true
   * ```
   */
  async getSettings(vmindex: number): Promise<MuMuWritableSettings> {
    const raw = await this.getSetting({ vmindex, allWritable: true });
    const data = JSON.parse(raw) as Record<string, string>;

    const coerced: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "true") {
        coerced[key] = true;
      } else if (value === "false") {
        coerced[key] = false;
      } else if (value !== "" && !isNaN(Number(value))) {
        coerced[key] = Number(value);
      } else {
        coerced[key] = value;
      }
    }

    return coerced as unknown as MuMuWritableSettings;
  }

  /**
   * Set a custom display resolution.
   *
   * Automatically sets `resolution_mode` to `"custom"` and applies the
   * width, height, and DPI values.
   *
   * @param vmindex - Which player to configure.
   * @param width - Width in pixels (380-4096).
   * @param height - Height in pixels (380-4096).
   * @param dpi - Display DPI (10-960).
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setResolution(0, 1920, 1080, 280);
   * ```
   */
  async setResolution(
    vmindex: number,
    width: number,
    height: number,
    dpi: number,
  ): Promise<string> {
    const w = String(width) + ".000000";
    const h = String(height) + ".000000";
    const d = String(dpi) + ".000000";

    validateSetting("resolution_width.custom", String(width));
    validateSetting("resolution_height.custom", String(height));
    validateSetting("resolution_dpi.custom", String(dpi));

    return this.setSettingMulti({
      vmindex,
      entries: [
        { key: "resolution_mode", value: "custom" },
        { key: "resolution_width.custom", value: w },
        { key: "resolution_height.custom", value: h },
        { key: "resolution_dpi.custom", value: d },
      ],
    });
  }

  /**
   * Set the performance preset mode.
   *
   * @param vmindex - Which player to configure.
   * @param mode - The performance preset. See {@link PerformanceMode}.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setPerformanceMode(0, "high");
   * ```
   */
  async setPerformanceMode(
    vmindex: number,
    mode: PerformanceMode,
  ): Promise<string> {
    return this.setSetting({ vmindex, key: "performance_mode", value: mode });
  }

  /**
   * Set the GPU emulation preset mode.
   *
   * @param vmindex - Which player to configure.
   * @param mode - The GPU preset. See {@link GpuMode}.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setGpuMode(0, "high");
   * ```
   */
  async setGpuMode(vmindex: number, mode: GpuMode): Promise<string> {
    return this.setSetting({ vmindex, key: "gpu_mode", value: mode });
  }

  /**
   * Set the maximum frame rate.
   *
   * @param vmindex - Which player to configure.
   * @param fps - Maximum frames per second.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setFrameRate(0, 120);
   * ```
   */
  async setFrameRate(vmindex: number, fps: number): Promise<string> {
    if (fps < 1) {
      throw new MuMuError(
        `Frame rate must be at least 1, got ${fps}`,
        { stdout: "", stderr: "", exitCode: -1 },
      );
    }
    return this.setSetting({ vmindex, key: "max_frame_rate", value: String(fps) });
  }

  /**
   * Set the screen brightness.
   *
   * @param vmindex - Which player to configure.
   * @param brightness - Brightness level (0-100).
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setBrightness(0, 75);
   * ```
   */
  async setBrightness(vmindex: number, brightness: number): Promise<string> {
    return this.setSetting({
      vmindex,
      key: "screen_brightness",
      value: String(brightness),
    });
  }

  /**
   * Set custom CPU and memory allocation.
   *
   * Automatically sets `performance_mode` to `"custom"` and applies the
   * core count and memory values.
   *
   * @param vmindex - Which player to configure.
   * @param cores - Number of CPU cores (1-16).
   * @param memoryGb - Memory allocation in GB. Allowed values: 0.75, 1, 1.5, 1.75, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setCustomPerformance(0, 4, 8);
   * ```
   */
  async setCustomPerformance(
    vmindex: number,
    cores: number,
    memoryGb: number,
  ): Promise<string> {
    validateSetting("performance_cpu.custom", String(cores));
    validateSetting("performance_mem.custom", String(memoryGb));

    return this.setSettingMulti({
      vmindex,
      entries: [
        { key: "performance_mode", value: "custom" },
        { key: "performance_cpu.custom", value: String(cores) },
        { key: "performance_mem.custom", value: String(memoryGb) },
      ],
    });
  }

  /**
   * Set a custom GPU model string.
   *
   * Automatically sets `gpu_mode` to `"custom"` and applies the model.
   *
   * @param vmindex - Which player to configure.
   * @param gpuModel - The GPU model string (e.g. `"Adreno (TM) 630"`).
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setCustomGpu(0, "Adreno (TM) 630");
   * ```
   */
  async setCustomGpu(vmindex: number, gpuModel: string): Promise<string> {
    return this.setSettingMulti({
      vmindex,
      entries: [
        { key: "gpu_mode", value: "custom" },
        { key: "gpu_model.custom", value: gpuModel },
      ],
    });
  }

  /**
   * Configure the network bridge settings in a single call.
   *
   * Only the fields provided in the config will be set; omitted fields
   * are left unchanged.
   *
   * @param vmindex - Which player to configure.
   * @param config - Network bridge configuration. See {@link NetworkBridgeConfig}.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * await mumu.setNetworkBridge(0, {
   *   enabled: true,
   *   ipMode: "static",
   *   ipAddr: "192.168.0.100",
   *   gateway: "192.168.0.1",
   *   subnetMask: "255.255.255.0",
   *   dns1: "8.8.8.8",
   *   dns2: "8.8.4.4",
   * });
   * ```
   */
  async setNetworkBridge(
    vmindex: number,
    config: NetworkBridgeConfig,
  ): Promise<string> {
    const entries: { key: string; value: string }[] = [];

    if (config.enabled !== undefined)
      entries.push({ key: "net_bridge_open", value: String(config.enabled) });
    if (config.ipMode !== undefined)
      entries.push({ key: "net_bridge_ip_mode", value: config.ipMode });
    if (config.ipAddr !== undefined)
      entries.push({ key: "net_bridge_ip_addr", value: config.ipAddr });
    if (config.gateway !== undefined)
      entries.push({ key: "net_bridge_gateway", value: config.gateway });
    if (config.subnetMask !== undefined)
      entries.push({ key: "net_bridge_subnet_mask", value: config.subnetMask });
    if (config.dns1 !== undefined)
      entries.push({ key: "net_bridge_dns1", value: config.dns1 });
    if (config.dns2 !== undefined)
      entries.push({ key: "net_bridge_dns2", value: config.dns2 });
    if (config.card !== undefined)
      entries.push({ key: "net_bridge_card", value: config.card });

    if (entries.length === 0) {
      throw new MuMuError(
        "setNetworkBridge requires at least one config field to be set.",
        { stdout: "", stderr: "", exitCode: -1 },
      );
    }

    return this.setSettingMulti({ vmindex, entries });
  }

  // -----------------------------------------------------------------------
  // Simulation
  // -----------------------------------------------------------------------

  /**
   * Get a simulated device property value.
   *
   * @param vmindex - Which player(s) to query.
   * @param key - The property to read. See {@link SimulationKey}.
   * @returns The current value of the simulated property.
   */
  async getSimulation(
    vmindex: VmIndex,
    key: SimulationKey,
  ): Promise<string> {
    return this.execStdout([
      "simulation",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "--simu_key",
      key,
    ]);
  }

  /**
   * Set a simulated device property.
   *
   * @param vmindex - Which player(s) to update.
   * @param key - The property to modify. See {@link SimulationKey}.
   * @param value - The value to set. Pass `"__null__"` to clear it.
   * @returns Raw command output.
   *
   * @example
   * ```ts
   * // Set a custom IMEI
   * await mumu.setSimulation(0, "imei", "123456789012345");
   *
   * // Clear the simulated MAC address
   * await mumu.setSimulation(0, "mac_address", "__null__");
   * ```
   */
  async setSimulation(
    vmindex: VmIndex,
    key: SimulationKey,
    value: string,
  ): Promise<string> {
    return this.execStdout([
      "simulation",
      "--vmindex",
      normalizeVmIndex(vmindex),
      "--simu_key",
      key,
      "--simu_value",
      value,
    ]);
  }

  // -----------------------------------------------------------------------
  // Driver
  // -----------------------------------------------------------------------

  /**
   * Install a player driver.
   *
   * @param name - The driver to install. See {@link DriverName}.
   * @returns Raw command output.
   */
  async driverInstall(name: DriverName): Promise<string> {
    return this.execStdout(["driver", "install", "--name", name]);
  }

  /**
   * Uninstall a player driver.
   *
   * @param name - The driver to uninstall. See {@link DriverName}.
   * @returns Raw command output.
   */
  async driverUninstall(name: DriverName): Promise<string> {
    return this.execStdout(["driver", "uninstall", "--name", name]);
  }

  // -----------------------------------------------------------------------
  // Log
  // -----------------------------------------------------------------------

  /**
   * Enable MuMuManager logging.
   *
   * @returns Result with error status.
   */
  async logOn(): Promise<MuMuCommandResult[]> {
    return this.execCommandResult(["log", "on"]);
  }

  /**
   * Disable MuMuManager logging.
   *
   * @returns Result with error status.
   */
  async logOff(): Promise<MuMuCommandResult[]> {
    return this.execCommandResult(["log", "off"]);
  }
}
