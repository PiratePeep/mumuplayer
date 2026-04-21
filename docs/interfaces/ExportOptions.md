# Interface: ExportOptions

Defined in: [src/types.ts:177](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L177)

Options for exporting player data to `.mumudata` files.

## Properties

### dir?

> `optional` **dir?**: `string`

Defined in: [src/types.ts:179](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L179)

Directory to write the exported `.mumudata` file(s) to.

***

### name?

> `optional` **name?**: `string`

Defined in: [src/types.ts:182](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L182)

Custom filename for the exported file (without extension).

***

### zip?

> `optional` **zip?**: `boolean`

Defined in: [src/types.ts:191](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L191)

Use compressed (zip) file format for the export.

**Warning:** This flag is known to fail with error `-502` on some
MuMu Player versions. If you encounter this, omit the flag and
export as a regular `.mumudata` file instead.
