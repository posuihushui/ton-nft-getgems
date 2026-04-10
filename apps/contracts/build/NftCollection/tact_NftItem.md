# Tact compilation report
Contract: NftItem
BoC Size: 1038 bytes

## Structures (Structs and Messages)
Total structures: 28

### DataSize
TL-B: `_ cells:int257 bits:int257 refs:int257 = DataSize`
Signature: `DataSize{cells:int257,bits:int257,refs:int257}`

### SignedBundle
TL-B: `_ signature:fixed_bytes64 signedData:remainder<slice> = SignedBundle`
Signature: `SignedBundle{signature:fixed_bytes64,signedData:remainder<slice>}`

### StateInit
TL-B: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

### Context
TL-B: `_ bounceable:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounceable:bool,sender:address,value:int257,raw:^slice}`

### SendParameters
TL-B: `_ mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell value:int257 to:address bounce:bool = SendParameters`
Signature: `SendParameters{mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell,value:int257,to:address,bounce:bool}`

### MessageParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 to:address bounce:bool = MessageParameters`
Signature: `MessageParameters{mode:int257,body:Maybe ^cell,value:int257,to:address,bounce:bool}`

### DeployParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 bounce:bool init:StateInit{code:^cell,data:^cell} = DeployParameters`
Signature: `DeployParameters{mode:int257,body:Maybe ^cell,value:int257,bounce:bool,init:StateInit{code:^cell,data:^cell}}`

### StdAddress
TL-B: `_ workchain:int8 address:uint256 = StdAddress`
Signature: `StdAddress{workchain:int8,address:uint256}`

### VarAddress
TL-B: `_ workchain:int32 address:^slice = VarAddress`
Signature: `VarAddress{workchain:int32,address:^slice}`

### BasechainAddress
TL-B: `_ hash:Maybe int257 = BasechainAddress`
Signature: `BasechainAddress{hash:Maybe int257}`

### Deploy
TL-B: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

### DeployOk
TL-B: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

### FactoryDeploy
TL-B: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

### Transfer
TL-B: `transfer#5fcc3d14 query_id:uint64 new_owner:address response_destination:address custom_payload:Maybe ^cell forward_amount:coins forward_payload:remainder<slice> = Transfer`
Signature: `Transfer{query_id:uint64,new_owner:address,response_destination:address,custom_payload:Maybe ^cell,forward_amount:coins,forward_payload:remainder<slice>}`

### OwnershipAssigned
TL-B: `ownership_assigned#05138d91 query_id:uint64 prev_owner:address forward_payload:remainder<slice> = OwnershipAssigned`
Signature: `OwnershipAssigned{query_id:uint64,prev_owner:address,forward_payload:remainder<slice>}`

### Excesses
TL-B: `excesses#d53276db query_id:uint64 = Excesses`
Signature: `Excesses{query_id:uint64}`

### GetStaticData
TL-B: `get_static_data#2fcb26a2 query_id:uint64 = GetStaticData`
Signature: `GetStaticData{query_id:uint64}`

### ReportStaticData
TL-B: `report_static_data#8b771345 query_id:uint64 index:uint256 collection_address:address = ReportStaticData`
Signature: `ReportStaticData{query_id:uint64,index:uint256,collection_address:address}`

### Initialize
TL-B: `initialize#6b203fbd owner:address content:Maybe ^cell locked:bool = Initialize`
Signature: `Initialize{owner:address,content:Maybe ^cell,locked:bool}`

### SetLocked
TL-B: `set_locked#bb7f7d59 locked:bool = SetLocked`
Signature: `SetLocked{locked:bool}`

### NftData
TL-B: `_ is_initialized:bool index:int257 collection_address:address owner_address:address content:Maybe ^cell = NftData`
Signature: `NftData{is_initialized:bool,index:int257,collection_address:address,owner_address:address,content:Maybe ^cell}`

### NftItem$Data
TL-B: `_ collection_address:address index:int257 owner:address content:Maybe ^cell locked:bool initialized:bool = NftItem`
Signature: `NftItem{collection_address:address,index:int257,owner:address,content:Maybe ^cell,locked:bool,initialized:bool}`

### Mint
TL-B: `mint#f57f638d owner:address content:Maybe ^cell = Mint`
Signature: `Mint{owner:address,content:Maybe ^cell}`

### BatchMint
TL-B: `batch_mint#ec90663e mints:dict<int, ^Mint{owner:address,content:Maybe ^cell}> = BatchMint`
Signature: `BatchMint{mints:dict<int, ^Mint{owner:address,content:Maybe ^cell}>}`

### ToggleTrading
TL-B: `toggle_trading#f1822da1 enabled:bool = ToggleTrading`
Signature: `ToggleTrading{enabled:bool}`

### BroadcastLock
TL-B: `broadcast_lock#fc1c7b8e locked:bool from_index:uint64 to_index:uint64 = BroadcastLock`
Signature: `BroadcastLock{locked:bool,from_index:uint64,to_index:uint64}`

### CollectionData
TL-B: `_ next_item_index:int257 content:^cell owner_address:address = CollectionData`
Signature: `CollectionData{next_item_index:int257,content:^cell,owner_address:address}`

### NftCollection$Data
TL-B: `_ next_item_index:uint64 owner:address content:^cell trading_enabled:bool = NftCollection`
Signature: `NftCollection{next_item_index:uint64,owner:address,content:^cell,trading_enabled:bool}`

## Get methods
Total get methods: 2

## get_nft_data
No arguments

## is_locked
No arguments

## Exit codes
* 2: Stack underflow
* 3: Stack overflow
* 4: Integer overflow
* 5: Integer out of expected range
* 6: Invalid opcode
* 7: Type check error
* 8: Cell overflow
* 9: Cell underflow
* 10: Dictionary error
* 11: 'Unknown' error
* 12: Fatal error
* 13: Out of gas error
* 14: Virtualization error
* 32: Action list is invalid
* 33: Action list is too long
* 34: Action is invalid or not supported
* 35: Invalid source address in outbound message
* 36: Invalid destination address in outbound message
* 37: Not enough Toncoin
* 38: Not enough extra currencies
* 39: Outbound message does not fit into a cell after rewriting
* 40: Cannot process a message
* 41: Library reference is null
* 42: Library change action error
* 43: Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree
* 50: Account state size exceeded limits
* 128: Null reference exception
* 129: Invalid serialization prefix
* 130: Invalid incoming message
* 131: Constraints error
* 132: Access denied
* 133: Contract stopped
* 134: Invalid argument
* 135: Code of a contract was not found
* 136: Invalid standard address
* 138: Not a basechain address
* 2977: Already initialized
* 5340: Only owner can toggle trading
* 7657: Not initialized
* 12308: Only collection can initialize
* 27983: Trading is locked for this item
* 36952: Only owner can transfer
* 47098: Only collection can change lock status
* 54045: Only owner can broadcast
* 57579: Only owner can mint

## Trait inheritance diagram

```mermaid
graph TD
NftItem
NftItem --> BaseTrait
NftItem --> Deployable
Deployable --> BaseTrait
```

## Contract dependency diagram

```mermaid
graph TD
NftItem
```