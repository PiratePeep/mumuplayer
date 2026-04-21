# Interface: ToolCmdOptions

Defined in: [src/types.ts:284](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L284)

Options for running toolbar commands (input simulation).

## Example

```ts
// Tap at coordinates (400, 300)
await mumu.toolCmd(0, { cmd: "input tap 400 300" });

// Swipe from (300,400) to (500,400) over 100ms
await mumu.toolCmd(0, { cmd: "input swipe 300 400 500 400 100" });

// Type text
await mumu.toolCmd(0, { cmd: "input_text", text: "hello world" });
```

## Properties

### cmd?

> `optional` **cmd?**: `string`

Defined in: [src/types.ts:306](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L306)

Shell-style command to execute on the player's toolbar.

This field is **required** by MuMuManager — omitting it (even when
`text` is provided) causes MuMuManager to return an error.

Supported patterns:
- `"input tap <x> <y>"` — tap at coordinates
- `"input swipe <x1> <y1> <x2> <y2> <duration_ms>"` — swipe gesture
- `"input swipe <x> <y> <x> <y> <duration_ms>"` — long press (same start/end)
- `"input keyevent <code>"` — send a key event (e.g. `4` for back)
- `"input_text"` — input text (provide content via [text](#text))

***

### text?

> `optional` **text?**: `string`

Defined in: [src/types.ts:291](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L291)

Text content to input alongside the command.

**Note:** MuMuManager requires `cmd` to be set when using `text`.
Passing `text` alone will result in an error from MuMuManager.
