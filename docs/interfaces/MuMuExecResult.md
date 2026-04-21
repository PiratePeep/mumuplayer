# Interface: MuMuExecResult

Defined in: [src/types.ts:755](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L755)

Raw result from executing a MuMuManager command.
Useful for inspecting stderr or exit codes when troubleshooting.

## Properties

### exitCode

> **exitCode**: `number`

Defined in: [src/types.ts:763](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L763)

Process exit code. Note: MuMuManager may return non-zero even on success.

***

### stderr

> **stderr**: `string`

Defined in: [src/types.ts:760](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L760)

Standard error output from the command.

***

### stdout

> **stdout**: `string`

Defined in: [src/types.ts:757](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L757)

Standard output from the command.
