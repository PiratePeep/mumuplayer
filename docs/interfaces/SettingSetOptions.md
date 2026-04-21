# Interface: SettingSetOptions

Defined in: [src/types.ts:357](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L357)

Options for setting a single key-value pair on a player.

## Properties

### key

> **key**: keyof MuMuWritableSettings \| `string` & `object`

Defined in: [src/types.ts:362](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L362)

The setting key to modify. Accepts any known [MuMuSettingKey](../type-aliases/MuMuSettingKey.md) or an arbitrary string.

***

### value

> **value**: `string`

Defined in: [src/types.ts:365](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L365)

The value to assign as a string. Use `"__null__"` to clear a setting.

***

### vmindex?

> `optional` **vmindex?**: [`VmIndex`](../type-aliases/VmIndex.md)

Defined in: [src/types.ts:359](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L359)

Target player index. If omitted, sets a global setting.
