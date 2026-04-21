# Interface: AppInfoOptions

Defined in: [src/types.ts:242](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L242)

Options for querying app state inside a player.

## Properties

### installed?

> `optional` **installed?**: `boolean`

Defined in: [src/types.ts:247](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L247)

When `true`, returns the currently active (foreground) app's package ID.

***

### package?

> `optional` **package?**: `string`

Defined in: [src/types.ts:244](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L244)

Check the running state of a specific app by its package bundle ID. Returns `"running"` or `"not_installed"` (meaning not currently running).
