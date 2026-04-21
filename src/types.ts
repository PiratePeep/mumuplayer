/**
 * Identifies one or more MuMu Player instances.
 *
 * - A single index number (e.g. `0`)
 * - An array of indices (e.g. `[3, 5, 6]`)
 * - The literal `"all"` to target every player
 *
 * @example
 * ```ts
 * // Single player
 * await mumu.launch(0);
 *
 * // Multiple players
 * await mumu.launch([1, 2, 3]);
 *
 * // All players
 * await mumu.launch("all");
 * ```
 */
export type VmIndex = number | number[] | "all";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Configuration options for the {@link MumuPlayer} constructor. */
export interface MumuPlayerConfig {
  /**
   * Absolute path to MuMuManager.exe.
   * @default "C:\\Program Files\\Netease\\MuMuPlayer\\nx_main\\MuMuManager.exe"
   */
  mumuPath?: string;
}

// ---------------------------------------------------------------------------
// Info
// ---------------------------------------------------------------------------

/**
 * Fields that are always present on a MuMu Player instance,
 * regardless of whether it is running or stopped.
 */
export interface MuMuPlayerBaseInfo {
  /** Unix timestamp (microseconds) when the player was created. */
  created_timestamp: number;

  /** Size of the player's virtual disk in bytes. */
  disk_size_bytes: number;

  /** Error code from the last operation, `0` means no error. */
  error_code: number;

  /** Whether Hyper-V is enabled on the host system. */
  hyperv_enabled: boolean;

  /** Zero-based index that uniquely identifies this player instance. */
  index: number;

  /** Whether the Android OS inside the player has finished booting. */
  is_android_started: boolean;

  /** Whether this is the primary/main player instance. */
  is_main: boolean;

  /** Whether the player process has been started (may still be booting). */
  is_process_started: boolean;

  /** Display name of the player instance. */
  name: string;
}

/**
 * Extended player info returned only when the player process is running.
 *
 * Discriminate from {@link MuMuPlayerBaseInfo} via `is_process_started`:
 *
 * @example
 * ```ts
 * const [player] = await mumu.getInfo(0);
 *
 * if (player.is_process_started) {
 *   // TypeScript narrows to MuMuPlayerRunningInfo
 *   console.log(player.pid, player.adb_port);
 * }
 * ```
 */
export interface MuMuPlayerRunningInfo extends MuMuPlayerBaseInfo {
  /** Narrows the union — always `true` for running players. */
  is_process_started: true;

  /** ADB host IP address used to connect to this player. */
  adb_host_ip: string;

  /** ADB port number. Combined with {@link adb_host_ip} forms the ADB serial (e.g. `"127.0.0.1:16384"`). */
  adb_port: number;

  /** PID of the headless (backend) process. */
  headless_pid: number;

  /** Error code from the most recent launch attempt. */
  launch_err_code: number;

  /** Human-readable error message from the most recent launch attempt. */
  launch_err_msg: string;

  /** Duration of the last launch in milliseconds. */
  launch_time: number;

  /** Window handle identifier for the main player window. */
  main_wnd: string;

  /** PID of the main player process. */
  pid: number;

  /**
   * Current lifecycle state of the player.
   *
   * Common values: `"start_finished"`, `"stop_finished"`, `"starting"`, `"stopping"`.
   */
  player_state: string;

  /** Window handle identifier for the render surface. */
  render_wnd: string;

  /** Whether VT-x / hardware virtualization is enabled on the host. */
  vt_enabled: boolean;
}

/**
 * Information about a MuMu Player instance, as returned by the `info` command.
 *
 * This is a discriminated union: when `is_process_started` is `true`,
 * runtime-only fields (PID, ADB port, window handles, etc.) are available.
 * When `false`, only the base fields are present.
 *
 * @example
 * ```ts
 * const [player] = await mumu.getInfo(0);
 * console.log(player.name); // always available
 *
 * if (player.is_process_started) {
 *   console.log(player.pid, player.adb_port); // safe after narrowing
 * }
 * ```
 */
export type MuMuPlayerInfo = MuMuPlayerBaseInfo | MuMuPlayerRunningInfo;

// ---------------------------------------------------------------------------
// Player Management Options
// ---------------------------------------------------------------------------

/** Options for creating new player instances. */
export interface CreateOptions {
  /** Target index to assign the new player. If omitted, the next available index is used. */
  vmindex?: VmIndex;

  /** Number of player instances to create. */
  number?: number;

  /** Use mini disk mode for the data disk (smaller initial size). */
  mini?: boolean;
}

/** Options for cloning an existing player. */
export interface CloneOptions {
  /** Number of clones to create from the source player. */
  number?: number;
}

/** Options for importing `.mumudata` backup files. */
export interface ImportOptions {
  /** Number of instances to import from the file. */
  number?: number;
}

/** Options for exporting player data to `.mumudata` files. */
export interface ExportOptions {
  /** Directory to write the exported `.mumudata` file(s) to. */
  dir?: string;

  /** Custom filename for the exported file (without extension). */
  name?: string;

  /**
   * Use compressed (zip) file format for the export.
   *
   * **Warning:** This flag is known to fail with error `-502` on some
   * MuMu Player versions. If you encounter this, omit the flag and
   * export as a regular `.mumudata` file instead.
   */
  zip?: boolean;
}

// ---------------------------------------------------------------------------
// Control Options
// ---------------------------------------------------------------------------

/** Options for the {@link MumuPlayer.launch} command. */
export interface LaunchOptions {
  /** App package to auto-launch after the player starts. */
  package?: string;
}

/** Options for positioning and sizing a player window. */
export interface LayoutWindowOptions {
  /** X coordinate of the window's top-left corner (pixels from screen left). */
  posX?: number;

  /** Y coordinate of the window's top-left corner (pixels from screen top). */
  posY?: number;

  /** Width of the player window in pixels. */
  sizeW?: number;

  /** Height of the player window in pixels. */
  sizeH?: number;
}

/**
 * Result of a {@link MumuPlayer.layoutWindow} call, containing the
 * applied window position and size.
 */
export interface LayoutWindowResult {
  /** X coordinate of the window's top-left corner. */
  x: number;

  /** Y coordinate of the window's top-left corner. */
  y: number;

  /** Width of the player window in pixels. */
  width: number;

  /** Height of the player window in pixels. */
  height: number;
}

// ---------------------------------------------------------------------------
// Control > App
// ---------------------------------------------------------------------------

/** Options for querying app state inside a player. */
export interface AppInfoOptions {
  /** Check the running state of a specific app by its package bundle ID. Returns `"running"` or `"not_installed"` (meaning not currently running). */
  package?: string;

  /** When `true`, returns the currently active (foreground) app's package ID. */
  installed?: boolean;
}

// ---------------------------------------------------------------------------
// Control > Tool
// ---------------------------------------------------------------------------

/**
 * Names of toolbar functions that can be triggered via {@link MumuPlayer.toolFunc}.
 */
export type ToolFuncName =
  | "rotate"
  | "go_home"
  | "go_back"
  | "top_most"
  | "fullscreen"
  | "shake"
  | "screenshot"
  | "volume_up"
  | "volume_down"
  | "volume_mute";

/**
 * Options for running toolbar commands (input simulation).
 *
 * @example
 * ```ts
 * // Tap at coordinates (400, 300)
 * await mumu.toolCmd(0, { cmd: "input tap 400 300" });
 *
 * // Swipe from (300,400) to (500,400) over 100ms
 * await mumu.toolCmd(0, { cmd: "input swipe 300 400 500 400 100" });
 *
 * // Type text
 * await mumu.toolCmd(0, { cmd: "input_text", text: "hello world" });
 * ```
 */
export interface ToolCmdOptions {
  /**
   * Text content to input alongside the command.
   *
   * **Note:** MuMuManager requires `cmd` to be set when using `text`.
   * Passing `text` alone will result in an error from MuMuManager.
   */
  text?: string;

  /**
   * Shell-style command to execute on the player's toolbar.
   *
   * This field is **required** by MuMuManager — omitting it (even when
   * `text` is provided) causes MuMuManager to return an error.
   *
   * Supported patterns:
   * - `"input tap <x> <y>"` — tap at coordinates
   * - `"input swipe <x1> <y1> <x2> <y2> <duration_ms>"` — swipe gesture
   * - `"input swipe <x> <y> <x> <y> <duration_ms>"` — long press (same start/end)
   * - `"input keyevent <code>"` — send a key event (e.g. `4` for back)
   * - `"input_text"` — input text (provide content via {@link text})
   */
  cmd?: string;
}

// ---------------------------------------------------------------------------
// Control > Shortcut
// ---------------------------------------------------------------------------

/** Options for creating a desktop shortcut for a player. */
export interface ShortcutCreateOptions {
  /** Display name of the shortcut. */
  name?: string;

  /** Path to a custom icon file for the shortcut. */
  icon?: string;

  /** App package bundle ID to launch when the shortcut is activated. */
  package?: string;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

/**
 * Options for reading player settings.
 *
 * @example
 * ```ts
 * // Get all writable settings for player 0
 * const json = await mumu.getSetting({ vmindex: 0, allWritable: true });
 * const settings = JSON.parse(json);
 * ```
 */
export interface SettingGetOptions {
  /** Target player index. If omitted, returns global settings. */
  vmindex?: VmIndex;

  /** One or more setting keys to query. */
  key?: string | string[];

  /** Return all settings (read-only and writable). */
  all?: boolean;

  /** Return only writable settings. */
  allWritable?: boolean;

  /** Include descriptive info for the requested setting key(s). */
  info?: boolean;
}

/** Options for setting a single key-value pair on a player. */
export interface SettingSetOptions {
  /** Target player index. If omitted, sets a global setting. */
  vmindex?: VmIndex;

  /** The setting key to modify. Accepts any known {@link MuMuSettingKey} or an arbitrary string. */
  key: MuMuSettingKey | (string & {});

  /** The value to assign as a string. Use `"__null__"` to clear a setting. */
  value: string;
}

/** Options for setting multiple key-value pairs in a single call. */
export interface SettingSetMultiOptions {
  /** Target player index. If omitted, sets global settings. */
  vmindex?: VmIndex;

  /** Array of key-value pairs to set. */
  entries: { key: MuMuSettingKey | (string & {}); value: string }[];
}

/** Options for applying settings from a JSON file. */
export interface SettingFromFileOptions {
  /** Target player index. If omitted, applies to global settings. */
  vmindex?: VmIndex;

  /** Path to a UTF-8 encoded JSON file containing setting key-value pairs. */
  path: string;
}

// ---------------------------------------------------------------------------
// Setting value types
// ---------------------------------------------------------------------------

/**
 * Performance preset mode.
 *
 * Each mode maps to a predefined CPU core count and memory allocation:
 * - `"low"` — 1 core, 1 GB
 * - `"middle"` — 4 cores, 5 GB
 * - `"high"` — 6 cores, 9 GB
 * - `"custom"` — user-defined via `performance_cpu.custom` and `performance_mem.custom`
 */
export type PerformanceMode = "low" | "middle" | "high" | "custom";

/**
 * GPU emulation preset mode.
 *
 * Each mode maps to a predefined GPU model string:
 * - `"low"` — Adreno (TM) 530
 * - `"middle"` — Adreno (TM) 640
 * - `"high"` — Adreno (TM) 740
 * - `"custom"` — user-defined via `gpu_model.custom`
 */
export type GpuMode = "low" | "middle" | "high" | "custom";

/**
 * Graphics renderer backend.
 *
 * - `"vk"` — Vulkan (recommended, better performance)
 * - `"gl"` — OpenGL
 */
export type RendererMode = "vk" | "gl";

/**
 * Renderer selection strategy.
 *
 * - `"auto"` — automatically select the best renderer for the system
 */
export type RendererStrategy = "auto" | (string & {});

/**
 * Network bridge IP assignment mode.
 *
 * - `"dhcp"` — obtain IP automatically
 * - `"static"` — use manually configured IP settings
 */
export type NetBridgeIpMode = "dhcp" | "static";

/**
 * Display resolution preset mode.
 *
 * Presets are organized by form factor and index:
 * - `"tablet.0"` through `"tablet.3"` — tablet resolutions (2560x1440 down to 1280x720)
 * - `"phone.0"` through `"phone.3"` — phone resolutions (1440x2560 down to 720x1280)
 * - `"widescreen.0"` through `"widescreen.3"` — ultrawide resolutions (3440x1440 down to 1680x720)
 * - `"custom"` — user-defined via `resolution_width.custom`, `resolution_height.custom`, `resolution_dpi.custom`
 */
export type ResolutionMode =
  | "tablet.0" | "tablet.1" | "tablet.2" | "tablet.3"
  | "phone.0" | "phone.1" | "phone.2" | "phone.3"
  | "widescreen.0" | "widescreen.1" | "widescreen.2" | "widescreen.3"
  | "custom";

// ---------------------------------------------------------------------------
// Writable settings interface
// ---------------------------------------------------------------------------

/**
 * All writable settings for a MuMu Player instance.
 *
 * Returned by {@link MumuPlayer.getSettings} with values coerced to their
 * proper TypeScript types. Keys match the exact strings used by MuMuManager's
 * `setting` command.
 *
 * @example
 * ```ts
 * const settings = await mumu.getSettings(0);
 * console.log(settings.max_frame_rate); // 60
 * console.log(settings.performance_mode); // "middle"
 * ```
 */
export interface MuMuWritableSettings {
  // --- Device identity ---

  /** Display name of the player instance. */
  player_name: string;

  /** Emulated phone manufacturer. */
  phone_brand: string;

  /** Emulated phone model name. */
  phone_model: string;

  /** Emulated phone MIIT identifier (regulatory model number). */
  phone_miit: string;

  /** Emulated phone IMEI number. */
  phone_imei: string;

  /** Emulated phone number (can be empty). */
  phone_number: string;

  // --- Renderer ---

  /** Graphics renderer backend. */
  renderer_mode: RendererMode;

  /** Renderer selection strategy. */
  renderer_strategy: RendererStrategy;

  /** Whether to force use of the discrete GPU. */
  force_discrete_graphics: boolean;

  // --- Display ---

  /**
   * Screen brightness level.
   * @minimum 0
   * @maximum 100
   */
  screen_brightness: number;

  /** Maximum frame rate cap. */
  max_frame_rate: number;

  /**
   * Lower bound for dynamic frame rate adjustment.
   *
   * Only takes effect when {@link dynamic_adjust_frame_rate} is `true`.
   *
   * Allowed values: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
   */
  dynamic_low_frame_rate_limit: number;

  /** Whether to dynamically adjust the frame rate based on load. */
  dynamic_adjust_frame_rate: boolean;

  /** Whether to display an FPS counter overlay. */
  show_frame_rate: boolean;

  /** Whether vertical sync is enabled. */
  vertical_sync: boolean;

  // --- Window ---

  /** Whether the window auto-rotates with the Android display orientation. */
  window_auto_rotate: boolean;

  /** Whether the window position and size are saved between sessions. */
  window_save_rect: boolean;

  /** Whether the window is locked to a fixed size. */
  window_size_fixed: boolean;

  // --- System ---

  /** Whether the system disk partition is read-only. */
  system_disk_readonly: boolean;

  /** Whether the system audio output is muted. */
  system_volume_close: boolean;

  /** Whether apps are kept alive in the background. */
  app_keptlive: boolean;

  /** Whether ADB root permission is enabled. */
  root_permission: boolean;

  /** Whether the data disk uses mini (smaller initial size) mode. */
  mini_disk: boolean;

  /** Whether to use a desktop-style mouse cursor inside the player. */
  mouse_style: boolean;

  /** Whether gamepads are automatically connected when detected. */
  joystick_auto_connect: boolean;

  /** Whether `.apk` files are associated with MuMu Player on the host. Note: key has a typo in MuMuManager. */
  apk_asscciation: boolean;

  /** Whether a confirmation dialog is shown when quitting the player. */
  quit_confirm: boolean;

  // --- Network bridge ---

  /** Whether the network bridge is enabled. */
  net_bridge_open: boolean;

  /** IP assignment mode for the network bridge. */
  net_bridge_ip_mode: NetBridgeIpMode;

  /** Static IP address (used when {@link net_bridge_ip_mode} is `"static"`). */
  net_bridge_ip_addr: string;

  /** Gateway address for the network bridge. */
  net_bridge_gateway: string;

  /** Subnet mask for the network bridge. */
  net_bridge_subnet_mask: string;

  /** Primary DNS server for the network bridge. */
  net_bridge_dns1: string;

  /** Secondary DNS server for the network bridge. */
  net_bridge_dns2: string;

  /** Host network adapter name for the bridge. */
  net_bridge_card: string;

  // --- Performance preset ---

  /** Performance preset mode. Changes CPU and memory allocation. */
  performance_mode: PerformanceMode;

  /**
   * Custom CPU core count (used when {@link performance_mode} is `"custom"`).
   *
   * Allowed values: 1 through 16
   */
  "performance_cpu.custom": number;

  /**
   * Custom memory allocation in GB (used when {@link performance_mode} is `"custom"`).
   *
   * Allowed values: 0.75, 1, 1.5, 1.75, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
   */
  "performance_mem.custom": number;

  // --- GPU preset ---

  /** GPU emulation preset mode. */
  gpu_mode: GpuMode;

  /** Custom GPU model string (used when {@link gpu_mode} is `"custom"`). */
  "gpu_model.custom": string;

  // --- Resolution preset ---

  /** Display resolution preset mode. */
  resolution_mode: ResolutionMode;

  /**
   * Custom resolution width in pixels (used when {@link resolution_mode} is `"custom"`).
   * @minimum 380
   * @maximum 4096
   */
  "resolution_width.custom": number;

  /**
   * Custom resolution height in pixels (used when {@link resolution_mode} is `"custom"`).
   * @minimum 380
   * @maximum 4096
   */
  "resolution_height.custom": number;

  /**
   * Custom resolution DPI (used when {@link resolution_mode} is `"custom"`).
   * @minimum 10
   * @maximum 960
   */
  "resolution_dpi.custom": number;
}

/**
 * Union of all writable MuMu Player setting keys.
 *
 * Use with {@link MumuPlayer.setSetting} for type-safe key autocomplete.
 */
export type MuMuSettingKey = keyof MuMuWritableSettings;

// ---------------------------------------------------------------------------
// Polling / Wait options
// ---------------------------------------------------------------------------

/** Options for polling-based wait methods. */
export interface WaitOptions {
  /**
   * Maximum time to wait in milliseconds before rejecting.
   * @default 120_000
   */
  timeout?: number;

  /**
   * Polling interval in milliseconds.
   * @default 2_000
   */
  interval?: number;
}

/** Options for {@link MumuPlayer.launchAndWait}. */
export interface LaunchAndWaitOptions extends LaunchOptions, WaitOptions {}

// ---------------------------------------------------------------------------
// Network bridge config
// ---------------------------------------------------------------------------

/** Configuration for the network bridge, used by {@link MumuPlayer.setNetworkBridge}. */
export interface NetworkBridgeConfig {
  /** Whether the network bridge is enabled. */
  enabled?: boolean;

  /** IP assignment mode for the network bridge. */
  ipMode?: NetBridgeIpMode;

  /** Static IP address (used when {@link ipMode} is `"static"`). */
  ipAddr?: string;

  /** Gateway address for the network bridge. */
  gateway?: string;

  /** Subnet mask for the network bridge. */
  subnetMask?: string;

  /** Primary DNS server for the network bridge. */
  dns1?: string;

  /** Secondary DNS server for the network bridge. */
  dns2?: string;

  /** Host network adapter name for the bridge. */
  card?: string;
}

// ---------------------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------------------

/**
 * Simulated device property keys.
 *
 * - `"android_id"` -- Simulate the Android ID
 * - `"mac_address"` -- Simulate the MAC address
 * - `"imei"` -- Simulate the IMEI number
 */
export type SimulationKey = "android_id" | "mac_address" | "imei";

// ---------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------

/**
 * Available driver names for installation/uninstallation.
 *
 * Currently only `"lwf"` (lightweight filter driver) is supported.
 */
export type DriverName = "lwf";

// ---------------------------------------------------------------------------
// Command result (returned by create, clone, delete, etc.)
// ---------------------------------------------------------------------------

/**
 * Result entry for a single player from a batch command (create, clone, delete, etc.).
 *
 * MuMuManager returns a JSON object keyed by player index, where each value
 * contains an error code and message.
 *
 * @example
 * ```ts
 * const results = await mumu.create({ number: 2 });
 * for (const r of results) {
 *   console.log(`Player ${r.index}: ${r.errcode === 0 ? "ok" : r.errmsg}`);
 * }
 * ```
 */
export interface MuMuCommandResult {
  /** The player index this result refers to. */
  index: number;

  /** Error code. `0` means success. */
  errcode: number;

  /** Human-readable error message, empty on success. */
  errmsg: string;
}

// ---------------------------------------------------------------------------
// Exec result (internal, but exported for advanced consumers)
// ---------------------------------------------------------------------------

/**
 * Raw result from executing a MuMuManager command.
 * Useful for inspecting stderr or exit codes when troubleshooting.
 */
export interface MuMuExecResult {
  /** Standard output from the command. */
  stdout: string;

  /** Standard error output from the command. */
  stderr: string;

  /** Process exit code. Note: MuMuManager may return non-zero even on success. */
  exitCode: number;
}
