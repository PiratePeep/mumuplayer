# Interface: SettingGetOptions

Defined in: [src/types.ts:339](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L339)

Options for reading player settings.

## Example

```ts
// Get all writable settings for player 0
const json = await mumu.getSetting({ vmindex: 0, allWritable: true });
const settings = JSON.parse(json);
```

## Properties

### all?

> `optional` **all?**: `boolean`

Defined in: [src/types.ts:347](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L347)

Return all settings (read-only and writable).

***

### allWritable?

> `optional` **allWritable?**: `boolean`

Defined in: [src/types.ts:350](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L350)

Return only writable settings.

***

### info?

> `optional` **info?**: `boolean`

Defined in: [src/types.ts:353](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L353)

Include descriptive info for the requested setting key(s).

***

### key?

> `optional` **key?**: `string` \| `string`[]

Defined in: [src/types.ts:344](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L344)

One or more setting keys to query.

***

### vmindex?

> `optional` **vmindex?**: [`VmIndex`](../type-aliases/VmIndex.md)

Defined in: [src/types.ts:341](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L341)

Target player index. If omitted, returns global settings.
