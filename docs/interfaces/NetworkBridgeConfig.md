# Interface: NetworkBridgeConfig

Defined in: [src/types.ts:668](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L668)

Configuration for the network bridge, used by [MumuPlayer.setNetworkBridge](../classes/MumuPlayer.md#setnetworkbridge).

## Properties

### card?

> `optional` **card?**: `string`

Defined in: [src/types.ts:691](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L691)

Host network adapter name for the bridge.

***

### dns1?

> `optional` **dns1?**: `string`

Defined in: [src/types.ts:685](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L685)

Primary DNS server for the network bridge.

***

### dns2?

> `optional` **dns2?**: `string`

Defined in: [src/types.ts:688](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L688)

Secondary DNS server for the network bridge.

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [src/types.ts:670](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L670)

Whether the network bridge is enabled.

***

### gateway?

> `optional` **gateway?**: `string`

Defined in: [src/types.ts:679](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L679)

Gateway address for the network bridge.

***

### ipAddr?

> `optional` **ipAddr?**: `string`

Defined in: [src/types.ts:676](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L676)

Static IP address (used when [ipMode](#ipmode) is `"static"`).

***

### ipMode?

> `optional` **ipMode?**: [`NetBridgeIpMode`](../type-aliases/NetBridgeIpMode.md)

Defined in: [src/types.ts:673](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L673)

IP assignment mode for the network bridge.

***

### subnetMask?

> `optional` **subnetMask?**: `string`

Defined in: [src/types.ts:682](https://github.com/PiratePeep/mumuplayer/blob/main/src/types.ts#L682)

Subnet mask for the network bridge.
