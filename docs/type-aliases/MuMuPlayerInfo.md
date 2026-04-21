# Type Alias: MuMuPlayerInfo

> **MuMuPlayerInfo** = [`MuMuPlayerBaseInfo`](../interfaces/MuMuPlayerBaseInfo.md) \| [`MuMuPlayerRunningInfo`](../interfaces/MuMuPlayerRunningInfo.md)

Defined in: [src/types.ts:146](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L146)

Information about a MuMu Player instance, as returned by the `info` command.

This is a discriminated union: when `is_process_started` is `true`,
runtime-only fields (PID, ADB port, window handles, etc.) are available.
When `false`, only the base fields are present.

## Example

```ts
const [player] = await mumu.getInfo(0);
console.log(player.name); // always available

if (player.is_process_started) {
  console.log(player.pid, player.adb_port); // safe after narrowing
}
```
