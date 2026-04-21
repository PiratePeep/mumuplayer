# Type Alias: PerformanceMode

> **PerformanceMode** = `"low"` \| `"middle"` \| `"high"` \| `"custom"`

Defined in: [src/types.ts:399](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L399)

Performance preset mode.

Each mode maps to a predefined CPU core count and memory allocation:
- `"low"` — 1 core, 1 GB
- `"middle"` — 4 cores, 5 GB
- `"high"` — 6 cores, 9 GB
- `"custom"` — user-defined via `performance_cpu.custom` and `performance_mem.custom`
