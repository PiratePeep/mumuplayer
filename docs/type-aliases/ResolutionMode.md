# Type Alias: ResolutionMode

> **ResolutionMode** = `"tablet.0"` \| `"tablet.1"` \| `"tablet.2"` \| `"tablet.3"` \| `"phone.0"` \| `"phone.1"` \| `"phone.2"` \| `"phone.3"` \| `"widescreen.0"` \| `"widescreen.1"` \| `"widescreen.2"` \| `"widescreen.3"` \| `"custom"`

Defined in: [src/types.ts:444](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L444)

Display resolution preset mode.

Presets are organized by form factor and index:
- `"tablet.0"` through `"tablet.3"` — tablet resolutions (2560x1440 down to 1280x720)
- `"phone.0"` through `"phone.3"` — phone resolutions (1440x2560 down to 720x1280)
- `"widescreen.0"` through `"widescreen.3"` — ultrawide resolutions (3440x1440 down to 1680x720)
- `"custom"` — user-defined via `resolution_width.custom`, `resolution_height.custom`, `resolution_dpi.custom`
