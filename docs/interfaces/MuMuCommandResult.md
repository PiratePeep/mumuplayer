# Interface: MuMuCommandResult

Defined in: [src/types.ts:736](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L736)

Result entry for a single player from a batch command (create, clone, delete, etc.).

MuMuManager returns a JSON object keyed by player index, where each value
contains an error code and message.

## Example

```ts
const results = await mumu.create({ number: 2 });
for (const r of results) {
  console.log(`Player ${r.index}: ${r.errcode === 0 ? "ok" : r.errmsg}`);
}
```

## Properties

### errcode

> **errcode**: `number`

Defined in: [src/types.ts:741](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L741)

Error code. `0` means success.

***

### errmsg

> **errmsg**: `string`

Defined in: [src/types.ts:744](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L744)

Human-readable error message, empty on success.

***

### index

> **index**: `number`

Defined in: [src/types.ts:738](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L738)

The player index this result refers to.
