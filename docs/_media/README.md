# mumuplayer

[![npm version](https://img.shields.io/npm/v/mumuplayer?style=for-the-badge&logo=npm&logoColor=white&color=%23cb3837)](https://www.npmjs.com/package/mumuplayer)
[![npm downloads](https://img.shields.io/npm/dm/mumuplayer?style=for-the-badge&logo=npm&logoColor=white&color=%23f59e0b)](https://www.npmjs.com/package/mumuplayer)
[![GitHub stars](https://img.shields.io/github/stars/PiratePeep/mumuplayer?style=for-the-badge&logo=github&logoColor=white&color=%23181717)](https://github.com/PiratePeep/mumuplayer)
[![license](https://img.shields.io/npm/l/mumuplayer?style=for-the-badge&logo=unlicense&logoColor=white&color=%2322c55e)](LICENSE.md)
[![node](https://img.shields.io/node/v/mumuplayer?style=for-the-badge&logo=nodedotjs&logoColor=white&color=%235fa04e)](package.json)
[![Bun](https://img.shields.io/badge/Bun-compatible-fbf0df?style=for-the-badge&logo=bun&logoColor=%23f9f1e1)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Type-safe TypeScript wrapper for [MuMu Player](https://www.mumuplayer.com/)'s `MuMuManager.exe` CLI. Control Android emulator instances programmatically from Node.js or Bun.

> [!NOTE]
> This library currently only supports **Windows**. Mac support coming soon.

## Features

- Full coverage of every MuMuManager subcommand
- Type-safe options and return types
- Targets one, many, or all player instances with [`VmIndex`](_media/VmIndex.md)

## Install

```bash
npm install mumuplayer
```

## Quick Start

```ts
import { MumuPlayer } from "mumuplayer";

const mumu = new MumuPlayer();

// List all players
const players = await mumu.getInfo();
console.log(players);

// Launch player 0
await mumu.launch(0);

// Install an APK
await mumu.appInstall(0, "C:\\path\\to\\app.apk");

// Shut down all players
await mumu.shutdown("all");
```

### Custom executable path

```ts
const mumu = new MumuPlayer({
  mumuPath: "D:\\MuMuPlayer\\nx_main\\MuMuManager.exe",
});
```

## API Overview

### Player Lifecycle

| Method | Description |
|--------|-------------|
| `version()` | Get the MuMu Player version string |
| `getInfo(vmindex?)` | Get detailed info for one, many, or all players |
| `create(options?)` | Create new player instance(s) |
| `clone(vmindex, options?)` | Clone an existing player |
| `delete(vmindex)` | Delete player(s) and their data |
| `rename(vmindex, name)` | Rename a player |
| `importData(path, options?)` | Import `.mumudata` backup files |
| `exportData(vmindex, options?)` | Export player data to `.mumudata` files |
| `sort()` | Auto-arrange all player windows |
| `assertExists()` | Verify that MuMuManager.exe exists on disk |

### Polling & Wait Helpers

| Method | Description |
|--------|-------------|
| `waitForBoot(vmindex, options?)` | Poll until Android has finished booting |
| `waitForShutdown(vmindex, options?)` | Poll until the player has fully stopped |
| `launchAndWait(vmindex, options?)` | Launch a player and wait until Android is ready |
| `restartAndWait(vmindex, options?)` | Restart a player and wait until Android is ready |

### State Queries

| Method | Description |
|--------|-------------|
| `isRunning(vmindex)` | Check if a player's process is running |
| `isAndroidReady(vmindex)` | Check if a player's Android OS has booted |
| `getRunningPlayers()` | Get all currently running player instances |
| `getStoppedPlayers()` | Get all currently stopped player instances |
| `getPlayerByName(name)` | Find a player by its display name |
| `getPlayerCount()` | Get the total number of player instances |

### Player Control

| Method | Description |
|--------|-------------|
| `launch(vmindex, options?)` | Start player(s), optionally auto-launching an app |
| `shutdown(vmindex)` | Shut down player(s) |
| `restart(vmindex)` | Restart player(s) |
| `showWindow(vmindex)` | Show/un-minimize player window(s) |
| `hideWindow(vmindex)` | Hide player window(s) |
| `layoutWindow(vmindex, options?)` | Position and resize a player window |

### App Management

| Method | Description |
|--------|-------------|
| `appInstall(vmindex, apkPath)` | Install an APK/APKS/XAPK file |
| `appUninstall(vmindex, packageId)` | Uninstall an app by package ID |
| `appLaunch(vmindex, packageId)` | Launch an app by package ID |
| `appClose(vmindex, packageId)` | Force-stop an app |
| `appRestart(vmindex, packageId)` | Close and relaunch an app |
| `appInfo(vmindex, options?)` | Query app state information |
| `isAppInstalled(vmindex, packageId)` | Check if an app is installed (via `pm path`) |
| `isAppRunning(vmindex, packageId)` | Check if an app is currently running |
| `listInstalledApps(vmindex)` | List all installed package IDs |
| `getForegroundApp(vmindex)` | Get the currently active (foreground) app |

### Input Simulation

| Method | Description |
|--------|-------------|
| `tap(vmindex, x, y)` | Tap at a screen coordinate |
| `swipe(vmindex, x1, y1, x2, y2, durationMs?)` | Perform a swipe gesture |
| `longPress(vmindex, x, y, durationMs?)` | Long press at a coordinate |
| `inputText(vmindex, text)` | Type text into the focused input field |
| `keyEvent(vmindex, keyCode)` | Send an Android key event |
| `pressBack(vmindex)` | Press the Android back button |
| `pressHome(vmindex)` | Press the Android home button |

### Tools

| Method | Description |
|--------|-------------|
| `toolFunc(vmindex, name)` | Trigger toolbar actions (rotate, screenshot, etc.) |
| `toolCmd(vmindex, options)` | Low-level input simulation command |
| `toolDowncpu(vmindex, cap)` | Set CPU execution cap (1-100%) |
| `toolLocation(vmindex, lng, lat)` | Set GPS coordinates |
| `toolGyro(vmindex, x, y, z)` | Set gravity sensor values |

### Shortcuts

| Method | Description |
|--------|-------------|
| `shortcutCreate(vmindex, options?)` | Create a desktop shortcut |
| `shortcutDelete(vmindex)` | Delete a desktop shortcut |

### ADB & Shell

| Method | Description |
|--------|-------------|
| `adb(vmindex, cmd)` | Run an ADB command against player(s) |
| `shell(vmindex, cmd)` | Run a shell command inside the Android OS |
| `getAdbSerial(vmindex)` | Get the `host:port` ADB serial for a running player |
| `connectAdb(vmindex)` | Connect ADB to player(s) |
| `disconnectAdb(vmindex)` | Disconnect ADB from player(s) |
| `getProp(vmindex, prop)` | Get an Android system property |
| `setProp(vmindex, prop, value)` | Set an Android system property |
| `pushFile(vmindex, localPath, remotePath)` | Push a file to the player via ADB |
| `pullFile(vmindex, remotePath, localPath)` | Pull a file from the player via ADB |

### Settings

| Method | Description |
|--------|-------------|
| `getSetting(options?)` | Read raw player or global settings |
| `getSettings(vmindex)` | Get all writable settings as a typed object |
| `setSetting(options)` | Set a single key-value setting |
| `setSettingMulti(options)` | Set multiple key-value settings at once |
| `setSettingFromFile(options)` | Apply settings from a JSON file |
| `setResolution(vmindex, w, h, dpi)` | Set a custom display resolution |
| `setPerformanceMode(vmindex, mode)` | Set the performance preset (low/middle/high/custom) |
| `setCustomPerformance(vmindex, cores, memGb)` | Set custom CPU cores and memory |
| `setGpuMode(vmindex, mode)` | Set the GPU preset (low/middle/high/custom) |
| `setCustomGpu(vmindex, gpuModel)` | Set a custom GPU model string |
| `setFrameRate(vmindex, fps)` | Set the maximum frame rate |
| `setBrightness(vmindex, brightness)` | Set screen brightness (0-100) |
| `setNetworkBridge(vmindex, config)` | Configure network bridge settings |

### Simulation

| Method | Description |
|--------|-------------|
| `getSimulation(vmindex, key)` | Read a simulated device property |
| `setSimulation(vmindex, key, value)` | Set a simulated device property (Android ID, MAC, IMEI) |

### Drivers & Logging

| Method | Description |
|--------|-------------|
| `driverInstall(name)` | Install a player driver |
| `driverUninstall(name)` | Uninstall a player driver |
| `logOn()` | Enable MuMuManager logging |
| `logOff()` | Disable MuMuManager logging |

### Advanced

| Method | Description |
|--------|-------------|
| `rawExec(args)` | Execute an arbitrary MuMuManager.exe command |

## Error Handling

The library exports two error classes:

```ts
import { MuMuError, MuMuNotFoundError } from "mumuplayer";

try {
  await mumu.launch(99);
} catch (err) {
  if (err instanceof MuMuNotFoundError) {
    console.error("MuMuManager not found at:", err.path);
  }
  if (err instanceof MuMuError) {
    console.error("Command failed:", err.exitCode, err.stderr);
  }
}
```

## VmIndex

Most methods accept a `VmIndex` parameter that can be:

- A single number: `0`
- An array of numbers: `[0, 1, 2]`
- The string `"all"` to target every player

```ts
await mumu.launch(0);           // one player
await mumu.launch([1, 2, 3]);   // multiple players
await mumu.shutdown("all");     // all players
```

## Documentation

- **[Full API Reference](_media/README.md)** — auto-generated TypeDoc Markdown
- **[api.json](_media/api.json)** — structured TypeDoc JSON for programmatic consumption

## License

[Unlicense](_media/LICENSE.md)
