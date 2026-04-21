# Class: MuMuManager

Defined in: [src/mumu-manager.ts:62](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L62)

TypeScript wrapper for the MuMu Player MuMuManager CLI.

Provides type-safe async methods for every MuMuManager subcommand including
player lifecycle management, app control, settings, simulation properties,
ADB/shell access, and more.

All commands are executed via [execa](https://github.com/sindresorhus/execa)
with array arguments to prevent shell injection.

## Example

```ts
import { MuMuManager } from "mumuplayer";

const mumu = new MuMuManager();

// List all players
const players = await mumu.getInfo("all");

// Launch player 0
await mumu.launch(0);

// Install an APK on player 0
await mumu.appInstall(0, "C:\\path\\to\\app.apk");
```

## Constructors

### Constructor

> **new MuMuManager**(`config?`): `MuMuManager`

Defined in: [src/mumu-manager.ts:70](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L70)

Create a new MuMuManager instance.

#### Parameters

##### config?

[`MuMuManagerConfig`](../interfaces/MuMuManagerConfig.md) = `{}`

Configuration options. See [MuMuManagerConfig](../interfaces/MuMuManagerConfig.md).

#### Returns

`MuMuManager`

## Methods

### adb()

> **adb**(`vmindex`, `cmd`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:741](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L741)

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

### appClose()

> **appClose**(`vmindex`, `packageId`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:481](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L481)

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

Defined in: [src/mumu-manager.ts:509](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L509)

Get app information from a player.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to query.

##### options?

[`AppInfoOptions`](../interfaces/AppInfoOptions.md) = `{}`

Query options. See [AppInfoOptions](../interfaces/AppInfoOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output (typically JSON).

#### Example

```ts
// List all installed apps
const result = await mumu.appInfo(0, { installed: true });

// Get info for a specific package
const result = await mumu.appInfo(0, { package: "com.example.app" });
```

***

### appInstall()

> **appInstall**(`vmindex`, `apkPath`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:424](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L424)

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

Defined in: [src/mumu-manager.ts:462](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L462)

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

### appUninstall()

> **appUninstall**(`vmindex`, `packageId`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:443](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L443)

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

### assertExists()

> **assertExists**(): `Promise`\<`void`\>

Defined in: [src/mumu-manager.ts:79](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L79)

Verify that the MuMuManager executable exists on disk.

#### Returns

`Promise`\<`void`\>

#### Throws

[MuMuNotFoundError](MuMuNotFoundError.md) When the executable is not found at the configured path.

***

### clone()

> **clone**(`vmindex`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:181](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L181)

Clone an existing player.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Index of the player to clone.

##### options?

[`CloneOptions`](../interfaces/CloneOptions.md) = `{}`

Clone options. See [CloneOptions](../interfaces/CloneOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### create()

> **create**(`options?`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:160](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L160)

Create new player instance(s).

#### Parameters

##### options?

[`CreateOptions`](../interfaces/CreateOptions.md) = `{}`

Creation options. See [CreateOptions](../interfaces/CreateOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### delete()

> **delete**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:195](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L195)

Delete player(s) and their data.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to delete.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### driverInstall()

> **driverInstall**(`name`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:948](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L948)

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

Defined in: [src/mumu-manager.ts:958](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L958)

Uninstall a player driver.

#### Parameters

##### name

`"lwf"`

The driver to uninstall. See [DriverName](../type-aliases/DriverName.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### exportData()

> **exportData**(`vmindex`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:247](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L247)

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

> **getInfo**(`vmindex?`): `Promise`\<[`MuMuPlayerInfo`](../interfaces/MuMuPlayerInfo.md)[]\>

Defined in: [src/mumu-manager.ts:140](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L140)

Get player info. Returns an array of [MuMuPlayerInfo](../interfaces/MuMuPlayerInfo.md) objects.

When `vmindex` is omitted every player is returned.

#### Parameters

##### vmindex?

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to query. Omit to get all.

#### Returns

`Promise`\<[`MuMuPlayerInfo`](../interfaces/MuMuPlayerInfo.md)[]\>

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

### getSetting()

> **getSetting**(`options?`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:797](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L797)

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

### getSimulation()

> **getSimulation**(`vmindex`, `key`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:892](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L892)

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

### hideWindow()

> **hideWindow**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:363](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L363)

Hide player window(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to hide.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### importData()

> **importData**(`path`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:223](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L223)

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

### launch()

> **launch**(`vmindex`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:296](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L296)

Launch player(s), optionally auto-launching an app by package name.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to launch.

##### options?

[`LaunchOptions`](../interfaces/LaunchOptions.md) = `{}`

Launch options. See [LaunchOptions](../interfaces/LaunchOptions.md).

#### Returns

`Promise`\<`string`\>

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

> **layoutWindow**(`vmindex`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:389](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L389)

Position and resize a player window.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to reposition.

##### options?

[`LayoutWindowOptions`](../interfaces/LayoutWindowOptions.md) = `{}`

Window layout options. See [LayoutWindowOptions](../interfaces/LayoutWindowOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

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

### logOff()

> **logOff**(): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:980](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L980)

Disable MuMuManager logging.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### logOn()

> **logOn**(): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:971](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L971)

Enable MuMuManager logging.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### rename()

> **rename**(`vmindex`, `name`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:206](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L206)

Rename a player.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player to rename.

##### name

`string`

The new display name.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### restart()

> **restart**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:333](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L333)

Restart player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to restart.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### setSetting()

> **setSetting**(`options`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:833](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L833)

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

Defined in: [src/mumu-manager.ts:870](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L870)

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

Defined in: [src/mumu-manager.ts:850](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L850)

Set multiple setting key-value pairs in one call.

#### Parameters

##### options

[`SettingSetMultiOptions`](../interfaces/SettingSetMultiOptions.md)

The entries array and optional vmindex. See [SettingSetMultiOptions](../interfaces/SettingSetMultiOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### setSimulation()

> **setSimulation**(`vmindex`, `key`, `value`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:922](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L922)

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

***

### shell()

> **shell**(`vmindex`, `cmd`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:766](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L766)

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

***

### shortcutCreate()

> **shortcutCreate**(`vmindex`, `options?`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:684](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L684)

Create a desktop shortcut for a player.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to create a shortcut for.

##### options?

[`ShortcutCreateOptions`](../interfaces/ShortcutCreateOptions.md) = `{}`

Shortcut options. See [ShortcutCreateOptions](../interfaces/ShortcutCreateOptions.md).

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### shortcutDelete()

> **shortcutDelete**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:707](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L707)

Delete the desktop shortcut for a player.

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to remove shortcuts for.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### showWindow()

> **showWindow**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:348](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L348)

Show player window(s) (un-minimize / bring to front).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to show.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### shutdown()

> **shutdown**(`vmindex`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:318](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L318)

Shutdown player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to shut down.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### sort()

> **sort**(): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:269](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L269)

Layout/sort all player windows on screen.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### toolCmd()

> **toolCmd**(`vmindex`, `options`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:576](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L576)

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

#### Example

```ts
// Tap at (400, 300)
await mumu.toolCmd(0, { cmd: "input tap 400 300" });

// Type text into the focused field
await mumu.toolCmd(0, { cmd: "input_text", text: "hello" });
```

***

### toolDowncpu()

> **toolDowncpu**(`vmindex`, `cap`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:599](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L599)

Set the CPU execution cap for player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to throttle.

##### cap

`number`

CPU cap percentage, must be between 1 and 100.

#### Returns

`Promise`\<`string`\>

Raw command output.

***

### toolFunc()

> **toolFunc**(`vmindex`, `name`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:548](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L548)

Trigger a toolbar function on player(s).

#### Parameters

##### vmindex

[`VmIndex`](../type-aliases/VmIndex.md)

Which player(s) to target.

##### name

[`ToolFuncName`](../type-aliases/ToolFuncName.md)

The toolbar function name. See [ToolFuncName](../type-aliases/ToolFuncName.md) for valid values.

#### Returns

`Promise`\<`string`\>

Raw command output.

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

> **toolGyro**(`vmindex`, `x`, `y`, `z`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:652](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L652)

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

`Promise`\<`string`\>

Raw command output.

***

### toolLocation()

> **toolLocation**(`vmindex`, `longitude`, `latitude`): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:625](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L625)

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

`Promise`\<`string`\>

Raw command output.

#### Example

```ts
// Set location to San Francisco
await mumu.toolLocation(0, -122.4194, 37.7749);
```

***

### version()

> **version**(): `Promise`\<`string`\>

Defined in: [src/mumu-manager.ts:118](https://github.com/PiratePeep/mumuplayer/blob/main/src/mumu-manager.ts#L118)

Get the MuMu Player version string.

#### Returns

`Promise`\<`string`\>

The version string reported by MuMuManager.
