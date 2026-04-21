# Interface: WaitOptions

Defined in: [src/types.ts:646](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L646)

Options for polling-based wait methods.

## Extended by

- [`LaunchAndWaitOptions`](LaunchAndWaitOptions.md)

## Properties

### interval?

> `optional` **interval?**: `number`

Defined in: [src/types.ts:657](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L657)

Polling interval in milliseconds.

#### Default

```ts
2_000
```

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [src/types.ts:651](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L651)

Maximum time to wait in milliseconds before rejecting.

#### Default

```ts
120_000
```
