# Type Alias: VmIndex

> **VmIndex** = `number` \| `number`[] \| `"all"`

Defined in: [src/types.ts:20](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L20)

Identifies one or more MuMu Player instances.

- A single index number (e.g. `0`)
- An array of indices (e.g. `[3, 5, 6]`)
- The literal `"all"` to target every player

## Example

```ts
// Single player
await mumu.launch(0);

// Multiple players
await mumu.launch([1, 2, 3]);

// All players
await mumu.launch("all");
```
