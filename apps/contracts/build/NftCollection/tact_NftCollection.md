# TACT Compilation Report
Contract: NftCollection
BOC Size: 1201 bytes

# Types
Total Types: 22

## StateInit
TLB: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

## StdAddress
TLB: `_ workchain:int8 address:uint256 = StdAddress`
Signature: `StdAddress{workchain:int8,address:uint256}`

## VarAddress
TLB: `_ workchain:int32 address:^slice = VarAddress`
Signature: `VarAddress{workchain:int32,address:^slice}`

## Context
TLB: `_ bounced:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounced:bool,sender:address,value:int257,raw:^slice}`

## SendParameters
TLB: `_ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters`
Signature: `SendParameters{bounce:bool,to:address,value:int257,mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell}`

## Deploy
TLB: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

## DeployOk
TLB: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

## FactoryDeploy
TLB: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

## Transfer
TLB: `transfer#5fcc3d14 query_id:uint64 new_owner:address response_destination:address custom_payload:Maybe ^cell forward_amount:coins forward_payload:remainder<slice> = Transfer`
Signature: `Transfer{query_id:uint64,new_owner:address,response_destination:address,custom_payload:Maybe ^cell,forward_amount:coins,forward_payload:remainder<slice>}`

## OwnershipAssigned
TLB: `ownership_assigned#05138d91 query_id:uint64 prev_owner:address forward_payload:remainder<slice> = OwnershipAssigned`
Signature: `OwnershipAssigned{query_id:uint64,prev_owner:address,forward_payload:remainder<slice>}`

## Excesses
TLB: `excesses#d53276db query_id:uint64 = Excesses`
Signature: `Excesses{query_id:uint64}`

## GetStaticData
TLB: `get_static_data#2fcb26a2 query_id:uint64 = GetStaticData`
Signature: `GetStaticData{query_id:uint64}`

## ReportStaticData
TLB: `report_static_data#8b771345 query_id:uint64 index:uint256 collection_address:address = ReportStaticData`
Signature: `ReportStaticData{query_id:uint64,index:uint256,collection_address:address}`

## Initialize
TLB: `initialize#6b203fbd owner:address content:Maybe ^cell locked:bool = Initialize`
Signature: `Initialize{owner:address,content:Maybe ^cell,locked:bool}`

## SetLocked
TLB: `set_locked#bb7f7d59 locked:bool = SetLocked`
Signature: `SetLocked{locked:bool}`

## NftData
TLB: `_ is_initialized:bool index:int257 collection_address:address owner_address:address content:Maybe ^cell = NftData`
Signature: `NftData{is_initialized:bool,index:int257,collection_address:address,owner_address:address,content:Maybe ^cell}`

## NftItem$Data
TLB: `null`
Signature: `null`

## Mint
TLB: `mint#f57f638d owner:address content:Maybe ^cell = Mint`
Signature: `Mint{owner:address,content:Maybe ^cell}`

## ToggleTrading
TLB: `toggle_trading#f1822da1 enabled:bool = ToggleTrading`
Signature: `ToggleTrading{enabled:bool}`

## BroadcastLock
TLB: `broadcast_lock#fc1c7b8e locked:bool from_index:uint64 to_index:uint64 = BroadcastLock`
Signature: `BroadcastLock{locked:bool,from_index:uint64,to_index:uint64}`

## CollectionData
TLB: `_ next_item_index:int257 content:^cell owner_address:address = CollectionData`
Signature: `CollectionData{next_item_index:int257,content:^cell,owner_address:address}`

## NftCollection$Data
TLB: `null`
Signature: `null`

# Get Methods
Total Get Methods: 3

## get_collection_data

## get_nft_address_by_index
Argument: index

## is_trading_enabled

# Error Codes
2: Stack underflow
3: Stack overflow
4: Integer overflow
5: Integer out of expected range
6: Invalid opcode
7: Type check error
8: Cell overflow
9: Cell underflow
10: Dictionary error
11: 'Unknown' error
12: Fatal error
13: Out of gas error
14: Virtualization error
32: Action list is invalid
33: Action list is too long
34: Action is invalid or not supported
35: Invalid source address in outbound message
36: Invalid destination address in outbound message
37: Not enough TON
38: Not enough extra-currencies
39: Outbound message does not fit into a cell after rewriting
40: Cannot process a message
41: Library reference is null
42: Library change action error
43: Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree
50: Account state size exceeded limits
128: Null reference exception
129: Invalid serialization prefix
130: Invalid incoming message
131: Constraints error
132: Access denied
133: Contract stopped
134: Invalid argument
135: Code of a contract was not found
136: Invalid address
137: Masterchain support is not enabled for this contract
2977: Already initialized
5340: Only owner can toggle trading
7657: Not initialized
12308: Only collection can initialize
27983: Trading is locked for this item
36952: Only owner can transfer
47098: Only collection can change lock status
54045: Only owner can broadcast
57579: Only owner can mint

# Trait Inheritance Diagram

```mermaid
graph TD
NftCollection
NftCollection --> BaseTrait
NftCollection --> Deployable
Deployable --> BaseTrait
```

# Contract Dependency Diagram

```mermaid
graph TD
NftCollection
NftCollection --> NftItem
```