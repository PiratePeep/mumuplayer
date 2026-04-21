# Interface: MuMuPlayerInfo

Defined in: [src/types.ts:43](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L43)

Detailed information about a single MuMu Player instance,
as returned by the `info` command.

## Properties

### adb\_host\_ip

> **adb\_host\_ip**: `string`

Defined in: [src/types.ts:45](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L45)

ADB host IP address used to connect to this player.

***

### adb\_port

> **adb\_port**: `number`

Defined in: [src/types.ts:48](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L48)

ADB port number. Combined with [adb\_host\_ip](#adb_host_ip) forms the ADB serial (e.g. `"127.0.0.1:16384"`).

***

### created\_timestamp

> **created\_timestamp**: `number`

Defined in: [src/types.ts:51](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L51)

Unix timestamp (seconds) when the player was created.

***

### disk\_size\_bytes

> **disk\_size\_bytes**: `number`

Defined in: [src/types.ts:54](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L54)

Size of the player's virtual disk in bytes.

***

### error\_code

> **error\_code**: `number`

Defined in: [src/types.ts:57](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L57)

Error code from the last operation, `0` means no error.

***

### headless\_pid

> **headless\_pid**: `number`

Defined in: [src/types.ts:60](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L60)

PID of the headless (backend) process, or `0` if not running.

***

### hyperv\_enabled

> **hyperv\_enabled**: `boolean`

Defined in: [src/types.ts:63](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L63)

Whether Hyper-V is enabled on the host system.

***

### index

> **index**: `number`

Defined in: [src/types.ts:66](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L66)

Zero-based index that uniquely identifies this player instance.

***

### is\_android\_started

> **is\_android\_started**: `boolean`

Defined in: [src/types.ts:69](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L69)

Whether the Android OS inside the player has finished booting.

***

### is\_main

> **is\_main**: `boolean`

Defined in: [src/types.ts:72](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L72)

Whether this is the primary/main player instance.

***

### is\_process\_started

> **is\_process\_started**: `boolean`

Defined in: [src/types.ts:75](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L75)

Whether the player process has been started (may still be booting).

***

### launch\_err\_code

> **launch\_err\_code**: `number`

Defined in: [src/types.ts:78](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L78)

Error code from the most recent launch attempt.

***

### launch\_err\_msg

> **launch\_err\_msg**: `string`

Defined in: [src/types.ts:81](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L81)

Human-readable error message from the most recent launch attempt.

***

### launch\_time

> **launch\_time**: `number`

Defined in: [src/types.ts:84](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L84)

Duration of the last launch in milliseconds.

***

### main\_wnd

> **main\_wnd**: `string`

Defined in: [src/types.ts:87](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L87)

Window handle identifier for the main player window.

***

### name

> **name**: `string`

Defined in: [src/types.ts:90](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L90)

Display name of the player instance.

***

### pid

> **pid**: `number`

Defined in: [src/types.ts:93](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L93)

PID of the main player process, or `0` if not running.

***

### player\_state

> **player\_state**: `string`

Defined in: [src/types.ts:100](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L100)

Current lifecycle state of the player.

Common values: `"start_finished"`, `"stop_finished"`, `"starting"`, `"stopping"`.

***

### render\_wnd

> **render\_wnd**: `string`

Defined in: [src/types.ts:103](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L103)

Window handle identifier for the render surface.

***

### vt\_enabled

> **vt\_enabled**: `boolean`

Defined in: [src/types.ts:106](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L106)

Whether VT-x / hardware virtualization is enabled on the host.
