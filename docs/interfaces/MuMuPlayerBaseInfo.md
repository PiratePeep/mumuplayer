# Interface: MuMuPlayerBaseInfo

Defined in: [src/types.ts:43](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L43)

Fields that are always present on a MuMu Player instance,
regardless of whether it is running or stopped.

## Extended by

- [`MuMuPlayerRunningInfo`](MuMuPlayerRunningInfo.md)

## Properties

### created\_timestamp

> **created\_timestamp**: `number`

Defined in: [src/types.ts:45](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L45)

Unix timestamp (microseconds) when the player was created.

***

### disk\_size\_bytes

> **disk\_size\_bytes**: `number`

Defined in: [src/types.ts:48](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L48)

Size of the player's virtual disk in bytes.

***

### error\_code

> **error\_code**: `number`

Defined in: [src/types.ts:51](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L51)

Error code from the last operation, `0` means no error.

***

### hyperv\_enabled

> **hyperv\_enabled**: `boolean`

Defined in: [src/types.ts:54](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L54)

Whether Hyper-V is enabled on the host system.

***

### index

> **index**: `number`

Defined in: [src/types.ts:57](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L57)

Zero-based index that uniquely identifies this player instance.

***

### is\_android\_started

> **is\_android\_started**: `boolean`

Defined in: [src/types.ts:60](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L60)

Whether the Android OS inside the player has finished booting.

***

### is\_main

> **is\_main**: `boolean`

Defined in: [src/types.ts:63](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L63)

Whether this is the primary/main player instance.

***

### is\_process\_started

> **is\_process\_started**: `boolean`

Defined in: [src/types.ts:66](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L66)

Whether the player process has been started (may still be booting).

***

### name

> **name**: `string`

Defined in: [src/types.ts:69](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L69)

Display name of the player instance.
