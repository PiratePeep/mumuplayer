# Class: MumuPlayer

Defined in: [src/mumu.ts:127](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L127)

TypeScript wrapper for the MuMu Player MuMuManager CLI.

Provides type-safe async methods for every MuMuManager subcommand including
player lifecycle management, app control, settings, simulation properties,
ADB/shell access, and more.

## Example

```ts
import { MumuPlayer } from "mumuplayer";

const mumu = new MumuPlayer();

// List all players
const players = await mumu.getInfo("all");

// Launch player 0
await mumu.launch(0);

// Install an APK on player 0
await mumu.appInstall(0, "C:\\path\\to\\app.apk");
```

## Constructors

### Constructor

> **new MumuPlayer**(`config?`): `MumuPlayer`

Defined in: [src/mumu.ts:135](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L135)

Create a new MumuPlayer instance.

#### Parameters

##### config?

[`MumuPlayerConfig`](../interfaces/MumuPlayerConfig.md) = `{}`

Configuration options. See [MumuPlayerConfig](../interfaces/MumuPlayerConfig.md).

#### Returns

`MumuPlayer`

## Lifecycle

### clone()

> **clone**(`vmindex`, `options?`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:320](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L320)

Clone an existing player.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Index of the player to clone.

##### options?

[`CloneOptions`](../interfaces/CloneOptions.md) = `{}`

Clone options. See [CloneOptions](../interfaces/CloneOptions.md).

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Array of results, one per cloned player, with the assigned index and error status.

***

### create()

> **create**(`options?`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:297](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L297)

Create new player instance(s).

#### Parameters

##### options?

[`CreateOptions`](../interfaces/CreateOptions.md) = `{}`

Creation options. See [CreateOptions](../interfaces/CreateOptions.md).

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Array of results, one per created player, with the assigned index and error status.

#### Example

```ts
const results = await mumu.create({ number: 2 });
for (const r of results) {
  console.log(`Player ${r.index}: ${r.errcode === 0 ? "ok" : r.errmsg}`);
}
```

***

### delete()

> **delete**(`vmindex`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:345](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L345)

Delete player(s) and their data.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to delete.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Array of results, one per deleted player, with error status.

***

### exportData()

> **exportData**(`vmindex`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:412](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L412)

Export player(s) as `.mumudata` backup files.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to export.

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md) = `{}`

Export options. See [ExportOptions](../interfaces/ExportOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
// Export player 0 as a compressed file
await mumu.exportData(0, { dir: "C:\\backups", zip: true });
```

***

### getInfo()

> **getInfo**(`vmindex?`): `Promise`\<[`MuMuPlayerInfo`](../type-aliases/MuMuPlayerInfo.md)[]\>

Defined in: [src/mumu.ts:265](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L265)

Get player info. Returns an array of [MuMuPlayerInfo](../type-aliases/MuMuPlayerInfo.md) objects.

When `vmindex` is omitted every player is returned.

#### Parameters

##### vmindex?

[`VmIndex`](../type-aliases/VmIndex.md) = `"all"`

Which player(s) to query. Omit to get all.

#### Returns

`Promise`\<[`MuMuPlayerInfo`](../type-aliases/MuMuPlayerInfo.md)[]\>

Array of player info objects.

#### Example

```ts
// Get info for all players
const all = await mumu.getInfo();

// Get info for a specific player
const [player] = await mumu.getInfo(0);
console.log(player.name, player.player_state);
```

***

### importData()

> **importData**(`path`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:386](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L386)

Import `.mumudata` backup file(s).

#### Parameters

##### path

`string`

Path to the `.mumudata` file.

##### options?

[`ImportOptions`](../interfaces/ImportOptions.md) = `{}`

Import options. See [ImportOptions](../interfaces/ImportOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### rename()

> **rename**(`vmindex`, `name`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:360](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L360)

Rename a player. The player must be stopped — renaming a running player
will not persist the new name.

#### Parameters

##### vmindex

`number`

Which player to rename (single index only).

##### name

`string`

The new display name.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Throws

[MuMuError](MuMuError.md) If the player is currently running.

***

### sort()

> **sort**(`options?`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:445](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L445)

Layout/sort all player windows on screen.

**Warning:** This command may hang if one or more player windows are
minimized when it runs. By default, `ignoreHang` is `true` and the
command will be silently killed after 3 seconds to prevent indefinite
blocking. Set `ignoreHang` to `false` to wait for the command to
complete normally.

#### Parameters

##### options?

Sort options.

###### ignoreHang?

`boolean`

Kill the command after 3s to avoid hangs. Defaults to `true`.

#### Returns

`Promise`\<`string`\>

Raw command output (may be empty if the command was killed).

***

### version()

> **version**(): `Promise`\<`string`\>

Defined in: [src/mumu.ts:241](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L241)

Get the MuMu Player version string.

#### Returns

`Promise`\<`string`\>

The version string reported by MuMuManager.

## Waiting

### launchAndWait()

> **launchAndWait**(`vmindex`, `options?`): `Promise`\<[`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)\>

Defined in: [src/mumu.ts:546](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L546)

Launch a player and wait until Android has finished booting.

Combines [launch](#launch) and [waitForBoot](#waitforboot) into a single call.

#### Parameters

##### vmindex

`number`

Which player to launch (single index).

##### options?

[`LaunchAndWaitOptions`](../interfaces/LaunchAndWaitOptions.md) = `{}`

Launch options plus timeout/interval. See [LaunchAndWaitOptions](../interfaces/LaunchAndWaitOptions.md).

#### Returns

`Promise`\<[`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)\>

The running player info once Android has booted.

#### Example

```ts
const info = await mumu.launchAndWait(0, {
  package: "com.example.app",
  timeout: 90_000,
});
console.log(`Player 0 ready on ADB port ${info.adb_port}`);
```

***

### restartAndWait()

> **restartAndWait**(`vmindex`, `options?`): `Promise`\<[`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)\>

Defined in: [src/mumu.ts:572](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L572)

Restart a player and wait until Android has finished booting.

Combines [restart](#restart) and [waitForBoot](#waitforboot) into a single call.

#### Parameters

##### vmindex

`number`

Which player to restart (single index).

##### options?

[`WaitOptions`](../interfaces/WaitOptions.md) = `{}`

Timeout and polling interval. See [WaitOptions](../interfaces/WaitOptions.md).

#### Returns

`Promise`\<[`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)\>

The running player info once Android has booted.

#### Example

```ts
const info = await mumu.restartAndWait(0);
console.log("Restarted and ready!");
```

***

### waitForBoot()

> **waitForBoot**(`vmindex`, `options?`): `Promise`\<[`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)\>

Defined in: [src/mumu.ts:474](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L474)

Wait until a player's Android OS has finished booting.

Polls [getInfo](#getinfo) until `is_android_started` is `true`, then returns
the full running info object.

#### Parameters

##### vmindex

`number`

Which player to wait for (single index).

##### options?

[`WaitOptions`](../interfaces/WaitOptions.md) = `{}`

Timeout and polling interval. See [WaitOptions](../interfaces/WaitOptions.md).

#### Returns

`Promise`\<[`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)\>

The running player info once Android has booted.

#### Throws

[MuMuError](MuMuError.md) If the timeout is reached before Android boots.

#### Example

```ts
await mumu.launch(0);
const info = await mumu.waitForBoot(0, { timeout: 60_000 });
console.log("Booted!", info.adb_port);
```

***

### waitForShutdown()

> **waitForShutdown**(`vmindex`, `options?`): `Promise`\<`void`\>

Defined in: [src/mumu.ts:511](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L511)

Wait until a player has fully shut down.

Polls [getInfo](#getinfo) until `is_process_started` is `false`.

#### Parameters

##### vmindex

`number`

Which player to wait for (single index).

##### options?

[`WaitOptions`](../interfaces/WaitOptions.md) = `{}`

Timeout and polling interval. See [WaitOptions](../interfaces/WaitOptions.md).

#### Returns

`Promise`\<`void`\>

#### Throws

[MuMuError](MuMuError.md) If the timeout is reached before shutdown completes.

#### Example

```ts
await mumu.shutdown(0);
await mumu.waitForShutdown(0);
console.log("Player 0 is fully stopped.");
```

## State

### getPlayerByName()

> **getPlayerByName**(`name`): `Promise`\<[`MuMuPlayerInfo`](../type-aliases/MuMuPlayerInfo.md) \| `undefined`\>

Defined in: [src/mumu.ts:676](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L676)

Find a player by its display name.

#### Parameters

##### name

`string`

The display name to search for.

#### Returns

`Promise`\<[`MuMuPlayerInfo`](../type-aliases/MuMuPlayerInfo.md) \| `undefined`\>

The first matching player, or `undefined` if none found.

#### Example

```ts
const player = await mumu.getPlayerByName("My Player");
if (player) {
  console.log(`Found at index ${player.index}`);
}
```

***

### getPlayerCount()

> **getPlayerCount**(): `Promise`\<`number`\>

Defined in: [src/mumu.ts:694](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L694)

Get the total number of player instances.

#### Returns

`Promise`\<`number`\>

The count of all player instances (running and stopped).

#### Example

```ts
const count = await mumu.getPlayerCount();
console.log(`${count} total players`);
```

***

### getRunningPlayers()

> **getRunningPlayers**(): `Promise`\<[`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)[]\>

Defined in: [src/mumu.ts:633](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L633)

Get all currently running player instances.

#### Returns

`Promise`\<[`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)[]\>

Array of running player info objects.

#### Example

```ts
const running = await mumu.getRunningPlayers();
console.log(`${running.length} players are running`);
```

***

### getStoppedPlayers()

> **getStoppedPlayers**(): `Promise`\<[`MuMuPlayerBaseInfo`](../interfaces/MuMuPlayerBaseInfo.md)[]\>

Defined in: [src/mumu.ts:653](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L653)

Get all currently stopped player instances.

#### Returns

`Promise`\<[`MuMuPlayerBaseInfo`](../interfaces/MuMuPlayerBaseInfo.md)[]\>

Array of stopped player info objects.

#### Example

```ts
const stopped = await mumu.getStoppedPlayers();
console.log(`${stopped.length} players are stopped`);
```

***

### isAndroidReady()

> **isAndroidReady**(`vmindex`): `Promise`\<`boolean`\>

Defined in: [src/mumu.ts:615](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L615)

Check if a player's Android OS has finished booting.

#### Parameters

##### vmindex

`number`

Which player to check.

#### Returns

`Promise`\<`boolean`\>

`true` if Android has booted, `false` otherwise.

#### Example

```ts
if (await mumu.isAndroidReady(0)) {
  console.log("Android is booted on player 0");
}
```

***

### isRunning()

> **isRunning**(`vmindex`): `Promise`\<`boolean`\>

Defined in: [src/mumu.ts:595](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L595)

Check if a player's process is currently running.

#### Parameters

##### vmindex

`number`

Which player to check.

#### Returns

`Promise`\<`boolean`\>

`true` if the player process is running, `false` otherwise.

#### Example

```ts
if (await mumu.isRunning(0)) {
  console.log("Player 0 is running");
}
```

## Window Control

### hideWindow()

> **hideWindow**(`vmindex`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:809](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L809)

Send a player window to the background (completely hidden, not just minimized).

The player must be running. Use [showWindow](#showwindow) to bring it back.

#### Parameters

##### vmindex

`number`

Which player to hide (single index only).

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status.

#### Throws

[MuMuError](MuMuError.md) If the player is not running.

***

### launch()

> **launch**(`vmindex`, `options?`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:720](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L720)

Launch player(s), optionally auto-launching an app by package name.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to launch.

##### options?

[`LaunchOptions`](../interfaces/LaunchOptions.md) = `{}`

Launch options. See [LaunchOptions](../interfaces/LaunchOptions.md).

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Raw command output.

#### Example

```ts
// Launch player 0
await mumu.launch(0);

// Launch player 1 and auto-start an app
await mumu.launch(1, { package: "com.example.app" });

// Launch all players
await mumu.launch("all");
```

***

### layoutWindow()

> **layoutWindow**(`vmindex`, `options?`): `Promise`\<[`LayoutWindowResult`](../interfaces/LayoutWindowResult.md)\>

Defined in: [src/mumu.ts:844](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L844)

Position and resize a player window.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to reposition.

##### options?

[`LayoutWindowOptions`](../interfaces/LayoutWindowOptions.md) = `{}`

Window layout options. See [LayoutWindowOptions](../interfaces/LayoutWindowOptions.md).

#### Returns

`Promise`\<[`LayoutWindowResult`](../interfaces/LayoutWindowResult.md)\>

The applied window position and size. See [LayoutWindowResult](../interfaces/LayoutWindowResult.md).

#### Example

```ts
await mumu.layoutWindow(0, {
  posX: 100,
  posY: 100,
  sizeW: 800,
  sizeH: 600,
});
```

***

### restart()

> **restart**(`vmindex`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:761](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L761)

Restart player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to restart.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Array of results with error status per player.

***

### showWindow()

> **showWindow**(`vmindex`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:782](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L782)

Bring a player window back from the background to the foreground.

The player must be running. This restores a window that was previously
sent to the background via [hideWindow](#hidewindow).

#### Parameters

##### vmindex

`number`

Which player to show (single index only).

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status.

#### Throws

[MuMuError](MuMuError.md) If the player is not running.

***

### shutdown()

> **shutdown**(`vmindex`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:744](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L744)

Shutdown player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to shut down.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Array of results with error status per player.

## Apps

### appClose()

> **appClose**(`vmindex`, `packageId`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:941](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L941)

Close (force-stop) an app by its package bundle ID.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to close the app on.

##### packageId

`string`

The app's package bundle ID.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### appInfo()

> **appInfo**(`vmindex`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:979](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L979)

Query app state on a player (raw JSON).

Note: `--package` returns `"running"` or `"not_installed"` (which really
means "not currently running" — it does **not** indicate whether the app
is installed). For convenience, use [isAppInstalled](#isappinstalled) for a reliable
installation check, [isAppRunning](#isapprunning) for a boolean running check, or
[getForegroundApp](#getforegroundapp) to get the active app.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to query.

##### options?

[`AppInfoOptions`](../interfaces/AppInfoOptions.md) = `{}`

Query options. See [AppInfoOptions](../interfaces/AppInfoOptions.md).

#### Returns

`Promise`\<`string`\>

JSON string with app state.

#### Example

```ts
// Get the currently active (foreground) app
const result = await mumu.appInfo(0, { installed: true });
// => '{ "active": "com.example.app" }'

// Check if a specific app is running
const result = await mumu.appInfo(0, { package: "com.example.app" });
// => '{ "state": "running" }' or '{ "state": "not_installed" }'
```

***

### appInstall()

> **appInstall**(`vmindex`, `apkPath`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:878](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L878)

Install an APK/APKS/XAPK file on player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to install the app on.

##### apkPath

`string`

Local file path to the `.apk`, `.apks`, or `.xapk` file.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.appInstall(0, "C:\\Downloads\\myapp.apk");
```

***

### appLaunch()

> **appLaunch**(`vmindex`, `packageId`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:920](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L920)

Launch an app by its package bundle ID inside player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to launch the app on.

##### packageId

`string`

The app's package bundle ID.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### appRestart()

> **appRestart**(`vmindex`, `packageId`): `Promise`\<`void`\>

Defined in: [src/mumu.ts:1638](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1638)

Restart an app by closing and relaunching it.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### packageId

`string`

The app's package bundle ID.

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await mumu.appRestart(0, "com.example.app");
```

***

### appUninstall()

> **appUninstall**(`vmindex`, `packageId`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:899](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L899)

Uninstall an app by its package bundle ID.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to uninstall from.

##### packageId

`string`

The app's package bundle ID (e.g. `"com.example.app"`).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### getForegroundApp()

> **getForegroundApp**(`vmindex`): `Promise`\<`string` \| `null`\>

Defined in: [src/mumu.ts:1615](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1615)

Get the package ID of the currently active (foreground) app.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player to query.

#### Returns

`Promise`\<`string` \| `null`\>

The foreground app's package ID, or `null` if it cannot be determined.

#### Example

```ts
const fg = await mumu.getForegroundApp(0);
console.log(fg); // "com.android.launcher3"
```

***

### isAppInstalled()

> **isAppInstalled**(`vmindex`, `packageId`): `Promise`\<`boolean`\>

Defined in: [src/mumu.ts:1014](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1014)

Check if an app is installed on a player.

Uses `pm path` via shell for a reliable result, unlike [appInfo](#appinfo)
which conflates "not running" with "not installed."

#### Parameters

##### vmindex

`number`

Which player to check (must be a single running player).

##### packageId

`string`

The app's package bundle ID.

#### Returns

`Promise`\<`boolean`\>

`true` if the app is installed, `false` otherwise.

#### Example

```ts
if (await mumu.isAppInstalled(0, "com.android.vending")) {
  console.log("Play Store is installed");
}
```

***

### isAppRunning()

> **isAppRunning**(`vmindex`, `packageId`): `Promise`\<`boolean`\>

Defined in: [src/mumu.ts:1591](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1591)

Check if an app is currently running (in the foreground or background).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player to query.

##### packageId

`string`

The app's package bundle ID.

#### Returns

`Promise`\<`boolean`\>

`true` if the app is running, `false` otherwise.

#### Example

```ts
if (await mumu.isAppRunning(0, "com.example.app")) {
  console.log("App is running");
}
```

***

### listInstalledApps()

> **listInstalledApps**(`vmindex`): `Promise`\<`string`[]\>

Defined in: [src/mumu.ts:1035](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1035)

List all installed app package IDs on a player.

Uses `pm list packages` via shell for a complete and reliable list.

#### Parameters

##### vmindex

`number`

Which player to query (must be a single running player).

#### Returns

`Promise`\<`string`[]\>

Array of package ID strings.

#### Example

```ts
const apps = await mumu.listInstalledApps(0);
console.log(apps); // ["com.android.vending", "com.android.settings", ...]
```

## Input

### inputText()

> **inputText**(`vmindex`, `text`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1297](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1297)

Type text into the currently focused input field.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### text

`string`

The text to type.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.inputText(0, "hello world");
```

***

### keyEvent()

> **keyEvent**(`vmindex`, `keyCode`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1316](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1316)

Send a key event by its Android keycode.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### keyCode

`number`

Android key event code (e.g. `4` for back, `3` for home).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
// Press the back button (keycode 4)
await mumu.keyEvent(0, 4);
```

***

### longPress()

> **longPress**(`vmindex`, `x`, `y`, `durationMs?`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1272](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1272)

Perform a long press at a screen coordinate.

Implemented as a swipe from the same point to the same point.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### x

`number`

X coordinate in pixels.

##### y

`number`

Y coordinate in pixels.

##### durationMs?

`number` = `1000`

Hold duration in milliseconds. Defaults to 1000.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.longPress(0, 400, 300, 2000);
```

***

### pressBack()

> **pressBack**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1328](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1328)

Press the Android back button.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### pressHome()

> **pressHome**(`vmindex`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:1340](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1340)

Press the Android home button.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status.

***

### swipe()

> **swipe**(`vmindex`, `x1`, `y1`, `x2`, `y2`, `durationMs?`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1241](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1241)

Perform a swipe gesture.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### x1

`number`

Start X coordinate.

##### y1

`number`

Start Y coordinate.

##### x2

`number`

End X coordinate.

##### y2

`number`

End Y coordinate.

##### durationMs?

`number` = `300`

Swipe duration in milliseconds. Defaults to 300.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
// Swipe right
await mumu.swipe(0, 100, 500, 600, 500, 200);
```

***

### tap()

> **tap**(`vmindex`, `x`, `y`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1218](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1218)

Tap at a screen coordinate.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### x

`number`

X coordinate in pixels.

##### y

`number`

Y coordinate in pixels.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.tap(0, 400, 300);
```

## Tools

### toolCmd()

> **toolCmd**(`vmindex`, `options`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1100](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1100)

Run a toolbar command for input simulation (tap, swipe, long press, text input).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### options

[`ToolCmdOptions`](../interfaces/ToolCmdOptions.md)

Command options. See [ToolCmdOptions](../interfaces/ToolCmdOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

**Note:** MuMuManager requires `cmd` to be present. Passing only
`text` without `cmd` will result in an error from MuMuManager.

#### Example

```ts
// Tap at (400, 300)
await mumu.toolCmd(0, { cmd: "input tap 400 300" });

// Type text into the focused field
await mumu.toolCmd(0, { cmd: "input_text", text: "hello" });

// Press the back button
await mumu.toolCmd(0, { cmd: "input keyevent 4" });
```

***

### toolDowncpu()

> **toolDowncpu**(`vmindex`, `cap`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:1125](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1125)

Set the CPU execution cap for player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to throttle.

##### cap

`number`

CPU cap percentage, must be between 1 and 100.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status per player.

***

### toolFunc()

> **toolFunc**(`vmindex`, `name`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:1064](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1064)

Trigger a toolbar function on player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### name

[`ToolFuncName`](../type-aliases/ToolFuncName.md)

The toolbar function name. See [ToolFuncName](../type-aliases/ToolFuncName.md) for valid values.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status.

#### Example

```ts
// Take a screenshot
await mumu.toolFunc(0, "screenshot");

// Rotate the screen
await mumu.toolFunc(0, "rotate");

// Go home
await mumu.toolFunc(0, "go_home");
```

***

### toolGyro()

> **toolGyro**(`vmindex`, `x`, `y`, `z`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:1182](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1182)

Set the gravity sensor (gyroscope) values for player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to update.

##### x

`number`

X-axis gravity value.

##### y

`number`

Y-axis gravity value.

##### z

`number`

Z-axis gravity value.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status per player.

***

### toolLocation()

> **toolLocation**(`vmindex`, `longitude`, `latitude`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:1153](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1153)

Set the GPS location for player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to update.

##### longitude

`number`

Longitude in degrees, range `[-180, 180]`.

##### latitude

`number`

Latitude in degrees, range `[-90, 90]`.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status per player.

#### Example

```ts
// Set location to San Francisco
await mumu.toolLocation(0, -122.4194, 37.7749);
```

## Shortcuts

### shortcutCreate()

> **shortcutCreate**(`vmindex`, `options?`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:1353](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1353)

Create a desktop shortcut for a player.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to create a shortcut for.

##### options?

[`ShortcutCreateOptions`](../interfaces/ShortcutCreateOptions.md) = `{}`

Shortcut options. See [ShortcutCreateOptions](../interfaces/ShortcutCreateOptions.md).

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status per player.

***

### shortcutDelete()

> **shortcutDelete**(`vmindex`): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:1378](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1378)

Delete the desktop shortcut for a player.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to remove shortcuts for.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status per player.

## ADB & Shell

### adb()

> **adb**(`vmindex`, `cmd`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1410](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1410)

Run an ADB command against player(s).

Supports built-in shortcuts: `connect`, `disconnect`, `getprop`, `setprop`,
`input_text`, and keyevents (`go_back`, `go_home`, `go_task`, `key_delete`,
`key_enter`, `key_space`, `volume_up`, `volume_down`, `volume_mute`).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### cmd

`string`

The ADB command string.

#### Returns

`Promise`\<`string`\>

Command output.

#### Example

```ts
// Connect ADB
await mumu.adb(0, "connect");

// Get a system property
const version = await mumu.adb(0, "getprop ro.build.version.sdk");
```

***

### connectAdb()

> **connectAdb**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1483](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1483)

Connect ADB to player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to connect.

#### Returns

`Promise`\<`string`\>

Command output.

***

### disconnectAdb()

> **disconnectAdb**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1495](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1495)

Disconnect ADB from player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to disconnect.

#### Returns

`Promise`\<`string`\>

Command output.

***

### getAdbSerial()

> **getAdbSerial**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1464](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1464)

Get the ADB serial string (`host:port`) for a running player.

Useful for connecting external ADB tools to the player.

#### Parameters

##### vmindex

`number`

Which player to query (must be running).

#### Returns

`Promise`\<`string`\>

ADB serial string (e.g. `"127.0.0.1:16384"`).

#### Throws

[MuMuError](MuMuError.md) If the player is not running.

#### Example

```ts
const serial = await mumu.getAdbSerial(0);
console.log(serial); // "127.0.0.1:16384"
```

***

### getProp()

> **getProp**(`vmindex`, `prop`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1514](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1514)

Get an Android system property.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to query.

##### prop

`string`

The property name (e.g. `"ro.build.version.sdk"`).

#### Returns

`Promise`\<`string`\>

The property value.

#### Example

```ts
const sdk = await mumu.getProp(0, "ro.build.version.sdk");
console.log(sdk); // "33"
```

***

### pullFile()

> **pullFile**(`vmindex`, `remotePath`, `localPath`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1571](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1571)

Pull a file from the player's filesystem to the host via ADB.

#### Parameters

##### vmindex

`number`

Which player to pull from (single index).

##### remotePath

`string`

Source path inside the player.

##### localPath

`string`

Destination host file path.

#### Returns

`Promise`\<`string`\>

Command output.

#### Example

```ts
await mumu.pullFile(0, "/sdcard/screenshot.png", "C:\\screenshots\\shot.png");
```

***

### pushFile()

> **pushFile**(`vmindex`, `localPath`, `remotePath`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1552](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1552)

Push a file from the host to the player's filesystem via ADB.

#### Parameters

##### vmindex

`number`

Which player to push to (single index).

##### localPath

`string`

Host file path.

##### remotePath

`string`

Destination path inside the player.

#### Returns

`Promise`\<`string`\>

Command output.

#### Example

```ts
await mumu.pushFile(0, "C:\\data\\config.json", "/sdcard/config.json");
```

***

### setProp()

> **setProp**(`vmindex`, `prop`, `value`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1533](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1533)

Set an Android system property.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to update.

##### prop

`string`

The property name.

##### value

`string`

The value to set.

#### Returns

`Promise`\<`string`\>

Command output.

#### Example

```ts
await mumu.setProp(0, "debug.layout", "true");
```

***

### shell()

> **shell**(`vmindex`, `cmd`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1437](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1437)

Run a shell command inside the player's Android OS.

Supports the same built-in shortcuts as [adb](#adb): `getprop`, `setprop`,
`input_text`, and keyevents.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### cmd

`string`

The shell command string.

#### Returns

`Promise`\<`string`\>

Command output.

#### Example

```ts
const sdk = await mumu.shell(0, "getprop ro.build.version.sdk");
```

## Settings

### getSetting()

> **getSetting**(`options?`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1662](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1662)

Read player settings.

Returns the raw JSON string from MuMuManager. The caller can `JSON.parse()`
the result to work with the data programmatically.

#### Parameters

##### options?

[`SettingGetOptions`](../interfaces/SettingGetOptions.md) = `{}`

Query options. See [SettingGetOptions](../interfaces/SettingGetOptions.md).

#### Returns

`Promise`\<`string`\>

JSON string of settings.

#### Example

```ts
// Get all writable settings for player 0
const raw = await mumu.getSetting({ vmindex: 0, allWritable: true });
const settings = JSON.parse(raw);
console.log(settings.max_frame_rate); // "60"
```

***

### getSettings()

> **getSettings**(`vmindex`): `Promise`\<[`MuMuWritableSettings`](../interfaces/MuMuWritableSettings.md)\>

Defined in: [src/mumu.ts:1778](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1778)

Get all writable settings for a player as a typed object.

Values are coerced from strings to their proper types (booleans, numbers).

#### Parameters

##### vmindex

`number`

Which player to query.

#### Returns

`Promise`\<[`MuMuWritableSettings`](../interfaces/MuMuWritableSettings.md)\>

Typed settings object. See [MuMuWritableSettings](../interfaces/MuMuWritableSettings.md).

#### Example

```ts
const settings = await mumu.getSettings(0);
console.log(settings.max_frame_rate); // 60
console.log(settings.performance_mode); // "middle"
console.log(settings.force_discrete_graphics); // true
```

***

### setBrightness()

> **setBrightness**(`vmindex`, `brightness`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1919](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1919)

Set the screen brightness.

#### Parameters

##### vmindex

`number`

Which player to configure.

##### brightness

`number`

Brightness level (0-100).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setBrightness(0, 75);
```

***

### setCustomGpu()

> **setCustomGpu**(`vmindex`, `gpuModel`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1979](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1979)

Set a custom GPU model string.

Automatically sets `gpu_mode` to `"custom"` and applies the model.

#### Parameters

##### vmindex

`number`

Which player to configure.

##### gpuModel

`string`

The GPU model string (e.g. `"Adreno (TM) 630"`).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setCustomGpu(0, "Adreno (TM) 630");
```

***

### setCustomPerformance()

> **setCustomPerformance**(`vmindex`, `cores`, `memoryGb`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1945](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1945)

Set custom CPU and memory allocation.

Automatically sets `performance_mode` to `"custom"` and applies the
core count and memory values.

#### Parameters

##### vmindex

`number`

Which player to configure.

##### cores

`number`

Number of CPU cores (1-16).

##### memoryGb

`number`

Memory allocation in GB. Allowed values: 0.75, 1, 1.5, 1.75, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setCustomPerformance(0, 4, 8);
```

***

### setFrameRate()

> **setFrameRate**(`vmindex`, `fps`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1895](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1895)

Set the maximum frame rate.

#### Parameters

##### vmindex

`number`

Which player to configure.

##### fps

`number`

Maximum frames per second.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setFrameRate(0, 120);
```

***

### setGpuMode()

> **setGpuMode**(`vmindex`, `mode`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1877](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1877)

Set the GPU emulation preset mode.

#### Parameters

##### vmindex

`number`

Which player to configure.

##### mode

[`GpuMode`](../type-aliases/GpuMode.md)

The GPU preset. See [GpuMode](../type-aliases/GpuMode.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setGpuMode(0, "high");
```

***

### setNetworkBridge()

> **setNetworkBridge**(`vmindex`, `config`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:2014](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L2014)

Configure the network bridge settings in a single call.

Only the fields provided in the config will be set; omitted fields
are left unchanged.

#### Parameters

##### vmindex

`number`

Which player to configure.

##### config

[`NetworkBridgeConfig`](../interfaces/NetworkBridgeConfig.md)

Network bridge configuration. See [NetworkBridgeConfig](../interfaces/NetworkBridgeConfig.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setNetworkBridge(0, {
  enabled: true,
  ipMode: "static",
  ipAddr: "192.168.0.100",
  gateway: "192.168.0.1",
  subnetMask: "255.255.255.0",
  dns1: "8.8.8.8",
  dns2: "8.8.4.4",
});
```

***

### setPerformanceMode()

> **setPerformanceMode**(`vmindex`, `mode`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1856](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1856)

Set the performance preset mode.

#### Parameters

##### vmindex

`number`

Which player to configure.

##### mode

[`PerformanceMode`](../type-aliases/PerformanceMode.md)

The performance preset. See [PerformanceMode](../type-aliases/PerformanceMode.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setPerformanceMode(0, "high");
```

***

### setResolution()

> **setResolution**(`vmindex`, `width`, `height`, `dpi`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1817](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1817)

Set a custom display resolution.

Automatically sets `resolution_mode` to `"custom"` and applies the
width, height, and DPI values.

#### Parameters

##### vmindex

`number`

Which player to configure.

##### width

`number`

Width in pixels (380-4096).

##### height

`number`

Height in pixels (380-4096).

##### dpi

`number`

Display DPI (10-960).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setResolution(0, 1920, 1080, 280);
```

***

### setSetting()

> **setSetting**(`options`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1700](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1700)

Set a single setting key-value pair.

#### Parameters

##### options

[`SettingSetOptions`](../interfaces/SettingSetOptions.md)

The key, value, and optional vmindex. See [SettingSetOptions](../interfaces/SettingSetOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
await mumu.setSetting({
  vmindex: 0,
  key: "max_frame_rate",
  value: "120",
});
```

***

### setSettingFromFile()

> **setSettingFromFile**(`options`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1749](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1749)

Apply settings from a JSON file.

#### Parameters

##### options

[`SettingFromFileOptions`](../interfaces/SettingFromFileOptions.md)

The file path and optional vmindex. See [SettingFromFileOptions](../interfaces/SettingFromFileOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### setSettingMulti()

> **setSettingMulti**(`options`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:1723](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L1723)

Set multiple setting key-value pairs in one call.

Validates each entry before sending the command.

#### Parameters

##### options

[`SettingSetMultiOptions`](../interfaces/SettingSetMultiOptions.md)

The entries array and optional vmindex. See [SettingSetMultiOptions](../interfaces/SettingSetMultiOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

## Simulation

### getSimulation()

> **getSimulation**(`vmindex`, `key`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:2056](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L2056)

Get a simulated device property value.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to query.

##### key

[`SimulationKey`](../type-aliases/SimulationKey.md)

The property to read. See [SimulationKey](../type-aliases/SimulationKey.md).

#### Returns

`Promise`\<`string`\>

The current value of the simulated property.

***

### setSimulation()

> **setSimulation**(`vmindex`, `key`, `value`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:2088](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L2088)

Set a simulated device property.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to update.

##### key

[`SimulationKey`](../type-aliases/SimulationKey.md)

The property to modify. See [SimulationKey](../type-aliases/SimulationKey.md).

##### value

`string`

The value to set. Pass `"__null__"` to clear it.

#### Returns

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
// Set a custom IMEI
await mumu.setSimulation(0, "imei", "123456789012345");

// Clear the simulated MAC address
await mumu.setSimulation(0, "mac_address", "__null__");
```

## Drivers

### driverInstall()

> **driverInstall**(`name`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:2112](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L2112)

Install a player driver.

#### Parameters

##### name

`"lwf"`

The driver to install. See [DriverName](../type-aliases/DriverName.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### driverUninstall()

> **driverUninstall**(`name`): `Promise`\<`string`\>

Defined in: [src/mumu.ts:2124](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L2124)

Uninstall a player driver.

#### Parameters

##### name

`"lwf"`

The driver to uninstall. See [DriverName](../type-aliases/DriverName.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

## Logging

### logOff()

> **logOff**(): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:2146](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L2146)

Disable MuMuManager logging.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status.

***

### logOn()

> **logOn**(): `Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Defined in: [src/mumu.ts:2135](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L2135)

Enable MuMuManager logging.

#### Returns

`Promise`\<[`MuMuCommandResult`](../interfaces/MuMuCommandResult.md)[]\>

Result with error status.

## Advanced

### assertExists()

> **assertExists**(): `Promise`\<`void`\>

Defined in: [src/mumu.ts:146](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L146)

Verify that the MuMuManager.exe executable exists on disk.

#### Returns

`Promise`\<`void`\>

#### Throws

[MuMuNotFoundError](MuMuNotFoundError.md) When the executable is not found at the configured path.

***

### rawExec()

> **rawExec**(`args`): `Promise`\<[`MuMuExecResult`](../interfaces/MuMuExecResult.md)\>

Defined in: [src/mumu.ts:230](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu.ts#L230)

Execute an arbitrary MuMuManager.exe command.

Escape hatch for advanced users who need to run commands not yet
wrapped by the library.

#### Parameters

##### args

`string`[]

Array of command-line arguments to pass to MuMuManager.exe.

#### Returns

`Promise`\<[`MuMuExecResult`](../interfaces/MuMuExecResult.md)\>

The raw exec result with stdout, stderr, and exit code.

#### Example

```ts
const result = await mumu.rawExec(["version"]);
console.log(result.stdout);
```
