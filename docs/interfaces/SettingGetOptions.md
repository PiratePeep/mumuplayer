# Interface: SettingGetOptions

Defined in: [src/types.ts:267](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L267)

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

Defined in: [src/types.ts:275](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L275)

Return all settings (read-only and writable).

***

### allWritable?

> `optional` **allWritable?**: `boolean`

Defined in: [src/types.ts:278](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L278)

Return only writable settings.

***

### info?

> `optional` **info?**: `boolean`

Defined in: [src/types.ts:281](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L281)

Include descriptive info for the requested setting key(s).

***

### key?

> `optional` **key?**: `string` \| `string`[]

Defined in: [src/types.ts:272](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L272)

One or more setting keys to query.

***

### vmindex?

> `optional` **vmindex?**: [`VmIndex`](../type-aliases/VmIndex.md)

Defined in: [src/types.ts:269](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L269)

Target player index. If omitted, returns global settings.
