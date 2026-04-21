# Interface: MuMuWritableSettings

Defined in: [src/types.ts:468](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L468)

All writable settings for a MuMu Player instance.

Returned by [MumuPlayer.getSettings](../classes/MumuPlayer.md#getsettings) with values coerced to their
proper TypeScript types. Keys match the exact strings used by MuMuManager's
`setting` command.

## Example

```ts
const settings = await mumu.getSettings(0);
console.log(settings.max_frame_rate); // 60
console.log(settings.performance_mode); // "middle"
```

## Properties

### apk\_asscciation

> **apk\_asscciation**: `boolean`

Defined in: [src/types.ts:561](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L561)

Whether `.apk` files are associated with MuMu Player on the host. Note: key has a typo in MuMuManager.

***

### app\_keptlive

> **app\_keptlive**: `boolean`

Defined in: [src/types.ts:546](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L546)

Whether apps are kept alive in the background.

***

### dynamic\_adjust\_frame\_rate

> **dynamic\_adjust\_frame\_rate**: `boolean`

Defined in: [src/types.ts:518](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L518)

Whether to dynamically adjust the frame rate based on load.

***

### dynamic\_low\_frame\_rate\_limit

> **dynamic\_low\_frame\_rate\_limit**: `number`

Defined in: [src/types.ts:515](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L515)

Lower bound for dynamic frame rate adjustment.

Only takes effect when [dynamic\_adjust\_frame\_rate](#dynamic_adjust_frame_rate) is `true`.

Allowed values: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60

***

### force\_discrete\_graphics

> **force\_discrete\_graphics**: `boolean`

Defined in: [src/types.ts:498](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L498)

Whether to force use of the discrete GPU.

***

### gpu\_mode

> **gpu\_mode**: [`GpuMode`](../type-aliases/GpuMode.md)

Defined in: [src/types.ts:614](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L614)

GPU emulation preset mode.

***

### gpu\_model.custom

> **gpu\_model.custom**: `string`

Defined in: [src/types.ts:617](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L617)

Custom GPU model string (used when [gpu\_mode](#gpu_mode) is `"custom"`).

***

### joystick\_auto\_connect

> **joystick\_auto\_connect**: `boolean`

Defined in: [src/types.ts:558](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L558)

Whether gamepads are automatically connected when detected.

***

### max\_frame\_rate

> **max\_frame\_rate**: `number`

Defined in: [src/types.ts:506](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L506)

Maximum frame rate cap.

***

### mini\_disk

> **mini\_disk**: `boolean`

Defined in: [src/types.ts:552](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L552)

Whether the data disk uses mini (smaller initial size) mode.

***

### mouse\_style

> **mouse\_style**: `boolean`

Defined in: [src/types.ts:555](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L555)

Whether to use a desktop-style mouse cursor inside the player.

***

### net\_bridge\_card

> **net\_bridge\_card**: `string`

Defined in: [src/types.ts:590](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L590)

Host network adapter name for the bridge.

***

### net\_bridge\_dns1

> **net\_bridge\_dns1**: `string`

Defined in: [src/types.ts:584](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L584)

Primary DNS server for the network bridge.

***

### net\_bridge\_dns2

> **net\_bridge\_dns2**: `string`

Defined in: [src/types.ts:587](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L587)

Secondary DNS server for the network bridge.

***

### net\_bridge\_gateway

> **net\_bridge\_gateway**: `string`

Defined in: [src/types.ts:578](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L578)

Gateway address for the network bridge.

***

### net\_bridge\_ip\_addr

> **net\_bridge\_ip\_addr**: `string`

Defined in: [src/types.ts:575](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L575)

Static IP address (used when [net\_bridge\_ip\_mode](#net_bridge_ip_mode) is `"static"`).

***

### net\_bridge\_ip\_mode

> **net\_bridge\_ip\_mode**: [`NetBridgeIpMode`](../type-aliases/NetBridgeIpMode.md)

Defined in: [src/types.ts:572](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L572)

IP assignment mode for the network bridge.

***

### net\_bridge\_open

> **net\_bridge\_open**: `boolean`

Defined in: [src/types.ts:569](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L569)

Whether the network bridge is enabled.

***

### net\_bridge\_subnet\_mask

> **net\_bridge\_subnet\_mask**: `string`

Defined in: [src/types.ts:581](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L581)

Subnet mask for the network bridge.

***

### performance\_cpu.custom

> **performance\_cpu.custom**: `number`

Defined in: [src/types.ts:602](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L602)

Custom CPU core count (used when [performance\_mode](#performance_mode) is `"custom"`).

Allowed values: 1 through 16

***

### performance\_mem.custom

> **performance\_mem.custom**: `number`

Defined in: [src/types.ts:609](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L609)

Custom memory allocation in GB (used when [performance\_mode](#performance_mode) is `"custom"`).

Allowed values: 0.75, 1, 1.5, 1.75, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16

***

### performance\_mode

> **performance\_mode**: [`PerformanceMode`](../type-aliases/PerformanceMode.md)

Defined in: [src/types.ts:595](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L595)

Performance preset mode. Changes CPU and memory allocation.

***

### phone\_brand

> **phone\_brand**: `string`

Defined in: [src/types.ts:475](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L475)

Emulated phone manufacturer.

***

### phone\_imei

> **phone\_imei**: `string`

Defined in: [src/types.ts:484](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L484)

Emulated phone IMEI number.

***

### phone\_miit

> **phone\_miit**: `string`

Defined in: [src/types.ts:481](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L481)

Emulated phone MIIT identifier (regulatory model number).

***

### phone\_model

> **phone\_model**: `string`

Defined in: [src/types.ts:478](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L478)

Emulated phone model name.

***

### phone\_number

> **phone\_number**: `string`

Defined in: [src/types.ts:487](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L487)

Emulated phone number (can be empty).

***

### player\_name

> **player\_name**: `string`

Defined in: [src/types.ts:472](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L472)

Display name of the player instance.

***

### quit\_confirm

> **quit\_confirm**: `boolean`

Defined in: [src/types.ts:564](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L564)

Whether a confirmation dialog is shown when quitting the player.

***

### renderer\_mode

> **renderer\_mode**: [`RendererMode`](../type-aliases/RendererMode.md)

Defined in: [src/types.ts:492](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L492)

Graphics renderer backend.

***

### renderer\_strategy

> **renderer\_strategy**: [`RendererStrategy`](../type-aliases/RendererStrategy.md)

Defined in: [src/types.ts:495](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L495)

Renderer selection strategy.

***

### resolution\_dpi.custom

> **resolution\_dpi.custom**: `number`

Defined in: [src/types.ts:631](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L631)

Custom resolution DPI, 10-960 (used when [resolution\_mode](#resolution_mode) is `"custom"`).

***

### resolution\_height.custom

> **resolution\_height.custom**: `number`

Defined in: [src/types.ts:628](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L628)

Custom resolution height in pixels, 380-4096 (used when [resolution\_mode](#resolution_mode) is `"custom"`).

***

### resolution\_mode

> **resolution\_mode**: [`ResolutionMode`](../type-aliases/ResolutionMode.md)

Defined in: [src/types.ts:622](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L622)

Display resolution preset mode.

***

### resolution\_width.custom

> **resolution\_width.custom**: `number`

Defined in: [src/types.ts:625](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L625)

Custom resolution width in pixels, 380-4096 (used when [resolution\_mode](#resolution_mode) is `"custom"`).

***

### root\_permission

> **root\_permission**: `boolean`

Defined in: [src/types.ts:549](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L549)

Whether ADB root permission is enabled.

***

### screen\_brightness

> **screen\_brightness**: `number`

Defined in: [src/types.ts:503](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L503)

Screen brightness level (0-100).

***

### show\_frame\_rate

> **show\_frame\_rate**: `boolean`

Defined in: [src/types.ts:521](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L521)

Whether to display an FPS counter overlay.

***

### system\_disk\_readonly

> **system\_disk\_readonly**: `boolean`

Defined in: [src/types.ts:540](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L540)

Whether the system disk partition is read-only.

***

### system\_volume\_close

> **system\_volume\_close**: `boolean`

Defined in: [src/types.ts:543](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L543)

Whether the system audio output is muted.

***

### vertical\_sync

> **vertical\_sync**: `boolean`

Defined in: [src/types.ts:524](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L524)

Whether vertical sync is enabled.

***

### window\_auto\_rotate

> **window\_auto\_rotate**: `boolean`

Defined in: [src/types.ts:529](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L529)

Whether the window auto-rotates with the Android display orientation.

***

### window\_save\_rect

> **window\_save\_rect**: `boolean`

Defined in: [src/types.ts:532](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L532)

Whether the window position and size are saved between sessions.

***

### window\_size\_fixed

> **window\_size\_fixed**: `boolean`

Defined in: [src/types.ts:535](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L535)

Whether the window is locked to a fixed size.
