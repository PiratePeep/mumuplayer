# Interface: MuMuPlayerRunningInfo

Defined in: [src/types.ts:87](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L87)

Extended player info returned only when the player process is running.

Discriminate from [MuMuPlayerBaseInfo](MuMuPlayerBaseInfo.md) via `is_process_started`:

## Example

```ts
const [player] = await mumu.getInfo(0);

if (player.is_process_started) {
  // TypeScript narrows to MuMuPlayerRunningInfo
  console.log(player.pid, player.adb_port);
}
```

## Extends

- [`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md)

## Properties

### adb\_host\_ip

> **adb\_host\_ip**: `string`

Defined in: [src/types.ts:92](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L92)

ADB host IP address used to connect to this player.

***

### adb\_port

> **adb\_port**: `number`

Defined in: [src/types.ts:95](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L95)

ADB port number. Combined with [adb\_host\_ip](#adb_host_ip) forms the ADB serial (e.g. `"127.0.0.1:16384"`).

***

### created\_timestamp

> **created\_timestamp**: `number`

Defined in: [src/types.ts:45](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L45)

Unix timestamp (microseconds) when the player was created.

#### Inherited from

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`created_timestamp`](MuMuPlayerBaseInfo.md#created_timestamp)

***

### disk\_size\_bytes

> **disk\_size\_bytes**: `number`

Defined in: [src/types.ts:48](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L48)

Size of the player's virtual disk in bytes.

#### Inherited from

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`disk_size_bytes`](MuMuPlayerBaseInfo.md#disk_size_bytes)

***

### error\_code

> **error\_code**: `number`

Defined in: [src/types.ts:51](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L51)

Error code from the last operation, `0` means no error.

#### Inherited from

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`error_code`](MuMuPlayerBaseInfo.md#error_code)

***

### headless\_pid

> **headless\_pid**: `number`

Defined in: [src/types.ts:98](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L98)

PID of the headless (backend) process.

***

### hyperv\_enabled

> **hyperv\_enabled**: `boolean`

Defined in: [src/types.ts:54](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L54)

Whether Hyper-V is enabled on the host system.

#### Inherited from

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`hyperv_enabled`](MuMuPlayerBaseInfo.md#hyperv_enabled)

***

### index

> **index**: `number`

Defined in: [src/types.ts:57](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L57)

Zero-based index that uniquely identifies this player instance.

#### Inherited from

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`index`](MuMuPlayerBaseInfo.md#index)

***

### is\_android\_started

> **is\_android\_started**: `boolean`

Defined in: [src/types.ts:60](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L60)

Whether the Android OS inside the player has finished booting.

#### Inherited from

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`is_android_started`](MuMuPlayerBaseInfo.md#is_android_started)

***

### is\_main

> **is\_main**: `boolean`

Defined in: [src/types.ts:63](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L63)

Whether this is the primary/main player instance.

#### Inherited from

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`is_main`](MuMuPlayerBaseInfo.md#is_main)

***

### is\_process\_started

> **is\_process\_started**: `true`

Defined in: [src/types.ts:89](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L89)

Narrows the union — always `true` for running players.

#### Overrides

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`is_process_started`](MuMuPlayerBaseInfo.md#is_process_started)

***

### launch\_err\_code

> **launch\_err\_code**: `number`

Defined in: [src/types.ts:101](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L101)

Error code from the most recent launch attempt.

***

### launch\_err\_msg

> **launch\_err\_msg**: `string`

Defined in: [src/types.ts:104](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L104)

Human-readable error message from the most recent launch attempt.

***

### launch\_time

> **launch\_time**: `number`

Defined in: [src/types.ts:107](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L107)

Duration of the last launch in milliseconds.

***

### main\_wnd

> **main\_wnd**: `string`

Defined in: [src/types.ts:110](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L110)

Window handle identifier for the main player window.

***

### name

> **name**: `string`

Defined in: [src/types.ts:69](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L69)

Display name of the player instance.

#### Inherited from

[`MuMuPlayerBaseInfo`](MuMuPlayerBaseInfo.md).[`name`](MuMuPlayerBaseInfo.md#name)

***

### pid

> **pid**: `number`

Defined in: [src/types.ts:113](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L113)

PID of the main player process.

***

### player\_state

> **player\_state**: `string`

Defined in: [src/types.ts:120](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L120)

Current lifecycle state of the player.

Common values: `"start_finished"`, `"stop_finished"`, `"starting"`, `"stopping"`.

***

### render\_wnd

> **render\_wnd**: `string`

Defined in: [src/types.ts:123](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L123)

Window handle identifier for the render surface.

***

### vt\_enabled

> **vt\_enabled**: `boolean`

Defined in: [src/types.ts:126](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L126)

Whether VT-x / hardware virtualization is enabled on the host.
