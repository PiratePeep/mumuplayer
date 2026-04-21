# Type Alias: GpuMode

> **GpuMode** = `"low"` \| `"middle"` \| `"high"` \| `"custom"`

Defined in: [src/types.ts:410](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L410)

GPU emulation preset mode.

Each mode maps to a predefined GPU model string:
- `"low"` — Adreno (TM) 530
- `"middle"` — Adreno (TM) 640
- `"high"` — Adreno (TM) 740
- `"custom"` — user-defined via `gpu_model.custom`
