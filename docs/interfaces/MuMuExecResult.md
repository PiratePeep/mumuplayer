# Interface: MuMuExecResult

Defined in: [src/types.ts:346](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L346)

Raw result from executing a MuMuManager command.
Useful for inspecting stderr or exit codes when troubleshooting.

## Properties

### exitCode

> **exitCode**: `number`

Defined in: [src/types.ts:354](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L354)

Process exit code. Note: MuMuManager may return non-zero even on success.

***

### stderr

> **stderr**: `string`

Defined in: [src/types.ts:351](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L351)

Standard error output from the command.

***

### stdout

> **stdout**: `string`

Defined in: [src/types.ts:348](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L348)

Standard output from the command.
