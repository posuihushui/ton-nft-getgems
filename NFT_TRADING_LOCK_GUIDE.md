# Standard NFT + Milestone Lock 方案

## 目标

这套合约现在的目标是两件事同时成立：

1. **尽量贴近 TON 官方 NFT reference contract 的标准行为**
2. **在不破坏标准接口的前提下增加 milestone lock 扩展**

当前实现位于：

- [apps/contracts/contracts/nft_collection.tact](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/contracts/nft_collection.tact)
- [apps/contracts/contracts/nft_item.tact](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/contracts/nft_item.tact)

## 标准兼容范围

当前 collection / item 已补齐这几类标准接口：

- **TEP-62 Collection getters**
  - `get_collection_data`
  - `get_nft_address_by_index`
  - `get_nft_content`
- **TEP-62 Item behavior**
  - `transfer`
  - `get_static_data`
  - `get_nft_data`
- **TEP-64 Off-chain metadata 组合**
  - collection 保存 `collection_content`
  - collection 保存 `common_content`
  - item 保存 `individual_content`
  - `get_nft_content` 返回 `offchain tag + common_content + individual_content`
- **TEP-66 Royalty**
  - `royalty_params`
  - `get_royalty_params`
  - `report_royalty_params`

在保持这套标准读取接口不变的前提下，collection 额外提供了 owner-only 的运维消息：

- `UpdateRoyalty`
  用来在部署后调整版税配置
- `WithdrawTon`
  用来提取 collection 中超出最小存储预留的 TON，避免运营过程中余额被困住

另外修复了 `report_static_data` 的标准 opcode，当前使用的是标准值 `0x8b771735`。

## Lock 扩展设计

标准 NFT 本身不提供“发行后先锁，里程碑到了再开交易”的能力，所以这里加了最小扩展：

- `SetMintLock`
  - 修改 **后续新 mint** 的默认锁状态
- `BroadcastLock`
  - 对 **已铸造 item** 按 index 范围广播 `SetLocked`
- `SetLocked`
  - item 级别的锁状态更新，只允许 collection 调用
- `is_locked`
  - item getter，供链下查询锁状态

`transfer` 的真正拦截点仍然在 item 合约内部。

## 为什么只保留单笔 Mint

当前 collection 只保留单笔 `Mint`，不再提供 `BatchMint`。

- 单笔 mint 更容易审计和追踪
- `next_item_index` 和链上交易回执可以一一对应
- 避免单次批量操作里出现部分成功、部分失败或静默截断
- milestone lock 的复杂度集中在 `BroadcastLock`，而不是 mint 接口

也就是说，当前约束是：

- `1 transaction = 1 NFT`

## 数据内容格式

为了让 `get_nft_content` 符合 TEP-64 的 off-chain 拼接方式，当前内容拆成三层：

### 1. `collection_content`

collection 自身的元数据地址，通常是完整的 collection JSON URL。

示例：

```ts
const collectionContent = beginCell()
  .storeUint(0, 8)
  .storeStringTail('https://example.com/collection.json')
  .endCell();
```

### 2. `common_content`

NFT item 元数据的公共前缀，不带 off-chain tag。

示例：

```ts
const commonContent = beginCell()
  .storeStringTail('https://example.com/nft/')
  .endCell();
```

### 3. `individual_content`

每个 item 自己的后缀。

示例：

```ts
const itemContent = beginCell()
  .storeStringTail('1.json')
  .endCell();
```

最终 `get_nft_content(index, individual_content)` 组合出的内容就是：

```text
offchain_tag + "https://example.com/nft/" + "1.json"
```

## Collection 初始化参数

当前 collection 初始化参数为：

```ts
NftCollection.fromInit(
  owner,
  collectionContent,
  commonContent,
  royaltyNumerator,
  royaltyDenominator,
  royaltyDestination
)
```

部署脚本见：

- [apps/contracts/scripts/deployNftCollection.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/deployNftCollection.ts)

默认推荐：

- `royaltyNumerator = 0`
- `royaltyDenominator = 1`
- `royaltyDestination = owner`

## 常用操作

### 单笔 Mint

```ts
await nftCollection.send(
  provider.sender(),
  { value: toNano('0.1') },
  {
    $$type: 'Mint',
    owner: recipientAddress,
    content: beginCell().storeStringTail('1.json').endCell(),
  }
);
```

### 解锁未来 mint

```ts
await nftCollection.send(
  provider.sender(),
  { value: toNano('0.05') },
  { $$type: 'SetMintLock', locked: false }
);
```

### 解锁已铸造范围

```ts
await nftCollection.send(
  provider.sender(),
  { value: toNano('1.0') },
  {
    $$type: 'BroadcastLock',
    locked: false,
    from_index: 0n,
    to_index: 50n,
  }
);
```

### 更新 Royalty

```ts
await nftCollection.send(
  provider.sender(),
  { value: toNano('0.05') },
  {
    $$type: 'UpdateRoyalty',
    numerator: 50n,
    denominator: 1000n,
    destination: newRoyaltyAddress,
  }
);
```

配套脚本见：

- [apps/contracts/scripts/updateRoyalty.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/updateRoyalty.ts)

### 提取 Collection 余额

```ts
await nftCollection.send(
  provider.sender(),
  { value: toNano('0.05') },
  {
    $$type: 'WithdrawTon',
    amount: toNano('1'),
    destination: treasuryAddress,
  }
);
```

配套脚本见：

- [apps/contracts/scripts/withdrawCollectionTon.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/withdrawCollectionTon.ts)

配套脚本见：

- [apps/contracts/scripts/unlockTrading.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/unlockTrading.ts)

## 行为语义

这里有一个需要明确的点：

- `SetMintLock` 只影响 **未来新 mint 的 item**
- `BroadcastLock` 影响 **已经存在的 item**
- `UpdateRoyalty` 只允许 **collection owner** 调用，更新后标准 royalty getter 会直接返回新值
- `WithdrawTon` 只允许 **collection owner** 调用，且只能提取超出最小存储预留的 TON

所以里程碑开启交易时，标准操作应该是：

1. 先调用 `SetMintLock { locked: false }`
2. 再对历史 item 分批调用 `BroadcastLock { locked: false, ... }`

如果要重新关闭交易，也是同理：

1. `SetMintLock { locked: true }`
2. `BroadcastLock { locked: true, ... }`

## GetGems 兼容性

| 功能 | 兼容性 |
|------|--------|
| NFT 显示 | ✅ 依赖标准 getter |
| Royalty 读取 | ✅ 通过 TEP-66 |
| 解锁后交易 | ✅ `transfer` 为标准接口 |
| 锁定时交易 | ✅ item 会拒绝 `transfer` |
| 锁状态展示 | ❌ 市场不会原生展示，需要链下读 `is_locked` |
| GetGems Minting API 直接复用 | ❌ 不可用，需直接调用自定义 collection |

## 验证建议

上线前至少做这几类检查：

- `get_collection_data` 返回的是 collection metadata cell
- `get_nft_content` 能正确拼出 item metadata URL
- `royalty_params` 与 `get_royalty_params` 一致
- `UpdateRoyalty` 后 getter 能读到新 royalty
- `WithdrawTon` 能成功提取 excess balance，且 collection 仍保留最小存储余额
- `get_static_data` 返回标准 opcode
- 锁定时 `transfer` 失败
- 解锁并广播后 `transfer` 成功
- 连续单笔 mint 时 `next_item_index` 递增符合预期

## 参考资料

- [TEP-62 NFT Standard](https://raw.githubusercontent.com/ton-blockchain/TEPs/master/text/0062-nft-standard.md)
- [TEP-64 Token Data Standard](https://raw.githubusercontent.com/ton-blockchain/TEPs/master/text/0064-token-data-standard.md)
- [TEP-66 NFT Royalty Standard](https://raw.githubusercontent.com/ton-blockchain/TEPs/master/text/0066-nft-royalty-standard.md)
- [TON NFT Reference Contracts](https://github.com/ton-blockchain/nft-contract)
- [TON NFT Reference Docs](https://docs.ton.org/standard/tokens/nft/reference)
