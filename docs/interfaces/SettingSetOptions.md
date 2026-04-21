# Interface: SettingSetOptions

Defined in: [src/types.ts:285](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L285)

Options for setting a single key-value pair on a player.

## Properties

### key

> **key**: `string`

Defined in: [src/types.ts:290](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L290)

The setting key to modify.

***

### value

> **value**: `string`

Defined in: [src/types.ts:293](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L293)

The value to assign. Use `"__null__"` to clear a setting.

***

### vmindex?

> `optional` **vmindex?**: [`VmIndex`](../type-aliases/VmIndex.md)

Defined in: [src/types.ts:287](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L287)

Target player index. If omitted, sets a global setting.
