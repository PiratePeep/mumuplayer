# Interface: LaunchAndWaitOptions

Defined in: [src/types.ts:661](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L661)

Options for [MumuPlayer.launchAndWait](../classes/MumuPlayer.md#launchandwait).

## Extends

- [`LaunchOptions`](LaunchOptions.md).[`WaitOptions`](WaitOptions.md)

## Properties

### interval?

> `optional` **interval?**: `number`

Defined in: [src/types.ts:657](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L657)

Polling interval in milliseconds.

#### Default

```ts
2_000
```

#### Inherited from

[`WaitOptions`](WaitOptions.md).[`interval`](WaitOptions.md#interval)

***

### package?

> `optional` **package?**: `string`

Defined in: [src/types.ts:201](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L201)

App package to auto-launch after the player starts.

#### Inherited from

[`LaunchOptions`](LaunchOptions.md).[`package`](LaunchOptions.md#package)

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [src/types.ts:651](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L651)

Maximum time to wait in milliseconds before rejecting.

#### Default

```ts
120_000
```

#### Inherited from

[`WaitOptions`](WaitOptions.md).[`timeout`](WaitOptions.md#timeout)
