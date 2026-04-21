# Interface: SettingSetMultiOptions

Defined in: [src/types.ts:369](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L369)

Options for setting multiple key-value pairs in a single call.

## Properties

### entries

> **entries**: `object`[]

Defined in: [src/types.ts:374](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L374)

Array of key-value pairs to set.

#### key

> **key**: keyof MuMuWritableSettings \| `string` & `object`

#### value

> **value**: `string`

***

### vmindex?

> `optional` **vmindex?**: [`VmIndex`](../type-aliases/VmIndex.md)

Defined in: [src/types.ts:371](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L371)

Target player index. If omitted, sets global settings.
