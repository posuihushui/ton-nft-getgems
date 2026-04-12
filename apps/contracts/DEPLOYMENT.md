# Contract Deployment

This document covers how to deploy the custom NFT collection contract from `apps/contracts` to both `testnet` and `mainnet`.

## Files

- [scripts/deployNftCollection.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/deployNftCollection.ts): deployment entrypoint
- [scripts/batchMintFromManifest.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/batchMintFromManifest.ts): sequential batch mint entrypoint
- [scripts/unlockTrading.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/unlockTrading.ts): unlock trading entrypoint
- [scripts/updateRoyalty.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/updateRoyalty.ts): owner-only royalty update entrypoint
- [scripts/withdrawCollectionTon.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/withdrawCollectionTon.ts): owner-only TON withdrawal entrypoint
- [.env.example](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/.env.example): environment template
- [contracts/nft_collection.tact](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/contracts/nft_collection.tact): collection contract
- [contracts/nft_item.tact](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/contracts/nft_item.tact): item contract

## Prerequisites

Run commands from the contract project directory:

```bash
cd /Users/lake/work/tbook/ton-nft-getgems/apps/contracts
```

Install dependencies:

```bash
npm install
```

Build contracts before deployment:

```bash
npm run build
```

## Environment Setup

Create a local env file:

```bash
cp .env.example .env
```

Blueprint loads `.env` automatically when you run commands from `apps/contracts`.

### Required variables

For each network you want to use, configure:

- `TESTNET_COLLECTION_CONTENT_URL` / `MAINNET_COLLECTION_CONTENT_URL`
- `TESTNET_COMMON_CONTENT_URL` / `MAINNET_COMMON_CONTENT_URL`
- `TESTNET_COLLECTION_ADDRESS` / `MAINNET_COLLECTION_ADDRESS` when running royalty updates
- `TESTNET_NEW_ROYALTY_NUMERATOR` / `MAINNET_NEW_ROYALTY_NUMERATOR` when running royalty updates
- `TESTNET_NEW_ROYALTY_DENOMINATOR` / `MAINNET_NEW_ROYALTY_DENOMINATOR` when running royalty updates
- `TESTNET_COLLECTION_ADDRESS` / `MAINNET_COLLECTION_ADDRESS` when running batch mint
- `TESTNET_BATCH_MINT_MANIFEST` / `MAINNET_BATCH_MINT_MANIFEST` when running batch mint
- `TESTNET_COLLECTION_ADDRESS` / `MAINNET_COLLECTION_ADDRESS` when running withdrawals
- `TESTNET_WITHDRAW_AMOUNT` / `MAINNET_WITHDRAW_AMOUNT` when running withdrawals

### Optional variables

- `TESTNET_ROYALTY_NUMERATOR` / `MAINNET_ROYALTY_NUMERATOR`
- `TESTNET_ROYALTY_DENOMINATOR` / `MAINNET_ROYALTY_DENOMINATOR`
- `TESTNET_ROYALTY_DESTINATION` / `MAINNET_ROYALTY_DESTINATION`
- `TESTNET_DEPLOY_VALUE` / `MAINNET_DEPLOY_VALUE`
- `TESTNET_BATCH_MINT_VALUE` / `MAINNET_BATCH_MINT_VALUE`
- `TESTNET_BATCH_MINT_START_INDEX` / `MAINNET_BATCH_MINT_START_INDEX`
- `TESTNET_BATCH_MINT_LIMIT` / `MAINNET_BATCH_MINT_LIMIT`
- `TESTNET_BATCH_MINT_DELAY_MS` / `MAINNET_BATCH_MINT_DELAY_MS`
- `TESTNET_NEW_ROYALTY_DESTINATION` / `MAINNET_NEW_ROYALTY_DESTINATION`
- `TESTNET_UPDATE_ROYALTY_VALUE` / `MAINNET_UPDATE_ROYALTY_VALUE`
- `TESTNET_WITHDRAW_DESTINATION` / `MAINNET_WITHDRAW_DESTINATION`
- `TESTNET_WITHDRAW_VALUE` / `MAINNET_WITHDRAW_VALUE`

If `ROYALTY_DESTINATION` is empty, the deploy script uses the deployer wallet address.
If `NEW_ROYALTY_DESTINATION` is empty, the update script keeps the current on-chain royalty destination.
If `WITHDRAW_DESTINATION` is empty, the withdraw script uses the current on-chain collection owner address.

If a network-specific variable is missing, the script falls back to the unprefixed generic key:

- `COLLECTION_CONTENT_URL`
- `COMMON_CONTENT_URL`
- `ROYALTY_NUMERATOR`
- `ROYALTY_DENOMINATOR`
- `ROYALTY_DESTINATION`
- `DEPLOY_VALUE`
- `COLLECTION_ADDRESS`
- `BATCH_MINT_MANIFEST`
- `BATCH_MINT_VALUE`
- `BATCH_MINT_START_INDEX`
- `BATCH_MINT_LIMIT`
- `BATCH_MINT_DELAY_MS`
- `NEW_ROYALTY_NUMERATOR`
- `NEW_ROYALTY_DENOMINATOR`
- `NEW_ROYALTY_DESTINATION`
- `UPDATE_ROYALTY_VALUE`
- `WITHDRAW_AMOUNT`
- `WITHDRAW_DESTINATION`
- `WITHDRAW_VALUE`

## Metadata Notes

`COLLECTION_CONTENT_URL` should be the full collection metadata URL.

Example:

```text
https://example.com/collection.json
```

`COMMON_CONTENT_URL` should be the common prefix used by item metadata.

Example:

```text
https://example.com/nft/
```

The contract will later combine that prefix with each item's individual content in `get_nft_content(...)`.

A ready-to-edit template is included in:

- [metadata/testnet/collection.json](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/metadata/testnet/collection.json)
- [metadata/testnet/nft/1.json](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/metadata/testnet/nft/1.json)
- [metadata/testnet/README.md](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/metadata/testnet/README.md)
- [metadata/generated/README.md](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/metadata/generated/README.md)

For that template, the env mapping is:

```env
TESTNET_COLLECTION_CONTENT_URL=https://testnet.example.com/collection.json
TESTNET_COMMON_CONTENT_URL=https://testnet.example.com/nft/
```

and the first mint would normally use:

```ts
content: beginCell().storeStringTail('1.json').endCell()
```

If you want to turn [getgems_batch_mint_template.csv](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/getgems_batch_mint_template.csv) into AWS-uploadable item metadata, run:

```bash
npm run generate-batch-metadata
```

This will generate one `id.json` file per CSV row plus a `manifest.json` under `metadata/generated/`.

The batch mint script consumes that `manifest.json` and sends one `Mint` per row.
Each row's `fileName` becomes the item's on-chain `individual_content`, for example `1.json`.

## Deploy Commands

### Testnet

Using TON Connect:

```bash
npm run deploy:testnet -- --tonconnect
```

Using mnemonic wallet:

```bash
npm run deploy:testnet -- --mnemonic
```

### Mainnet

Using TON Connect:

```bash
npm run deploy:mainnet -- --tonconnect
```

Using mnemonic wallet:

```bash
npm run deploy:mainnet -- --mnemonic
```

## Batch Mint Commands

The batch mint script wraps the existing single `Mint` message and submits one transaction per manifest row in sequence.
This keeps contract behavior unchanged while giving you an operator-side batch workflow.

Before running it:

1. Upload the generated metadata JSON files to your AWS/S3 prefix
2. Set `COMMON_CONTENT_URL` to that prefix, for example `https://static.example.com/nft/`
3. Set `COLLECTION_ADDRESS` to the deployed collection
4. Set `BATCH_MINT_MANIFEST` to the local manifest path if you are not using the default

### Testnet

Using TON Connect:

```bash
npm run batch-mint:testnet -- --tonconnect
```

Using mnemonic wallet:

```bash
npm run batch-mint:testnet -- --mnemonic
```

### Mainnet

Using TON Connect:

```bash
npm run batch-mint:mainnet -- --tonconnect
```

Using mnemonic wallet:

```bash
npm run batch-mint:mainnet -- --mnemonic
```

## Royalty Update Commands

The collection owner can update royalty parameters after deployment by sending `UpdateRoyalty`.
The update will be rejected if the sender is not the collection owner, if the denominator is `0`, or if the numerator is greater than the denominator.

### Testnet

Using TON Connect:

```bash
npm run update-royalty:testnet -- --tonconnect
```

Using mnemonic wallet:

```bash
npm run update-royalty:testnet -- --mnemonic
```

### Mainnet

Using TON Connect:

```bash
npm run update-royalty:mainnet -- --tonconnect
```

Using mnemonic wallet:

```bash
npm run update-royalty:mainnet -- --mnemonic
```

## Unlock Trading Script

[unlockTrading.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/unlockTrading.ts) is an operator helper for the milestone release step.
It performs the standard two-stage unlock flow already used by the contracts:

1. Sends `SetMintLock { locked: false }` so future mints are unlocked
2. Sends `BroadcastLock { locked: false, from_index: 0, to_index: next_item_index }` so already minted NFTs are unlocked

This script is meant for a one-shot "open trading" operation after your milestone is reached.
It does not change contract architecture and does not batch mint; it only coordinates the existing owner-only unlock messages.

### Current Behavior

The script reads the collection address from environment variables:

- `TESTNET_COLLECTION_ADDRESS`
- `MAINNET_COLLECTION_ADDRESS`

If those are not set, it falls back to the generic `COLLECTION_ADDRESS`.

### What It Calculates

The script reads `next_item_index` from the collection and estimates the broadcast cost as:

- `next_item_index * 0.02 TON`
- plus an extra `0.05 TON` buffer

It also waits 5 seconds between `SetMintLock` and `BroadcastLock` so the two steps do not race too tightly in normal operator usage.

### How To Run

From [apps/contracts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts):

Make sure `TESTNET_COLLECTION_ADDRESS` or `MAINNET_COLLECTION_ADDRESS` is set before running it.

Using TON Connect:

```bash
npx blueprint run unlockTrading --testnet --tonconnect
```

Using mnemonic wallet:

```bash
npx blueprint run unlockTrading --testnet --mnemonic
```

For mainnet:

```bash
npx blueprint run unlockTrading --mainnet --tonconnect
```

or

```bash
npx blueprint run unlockTrading --mainnet --mnemonic
```

### When To Use It

Use this script when:

- you have already minted NFTs
- trading is still locked
- you want both future mints and historical NFTs to become transferable

Do not use it if you only want to unlock future mints.
In that case, send only `SetMintLock`.

Do not use it if you want to unlock only part of the collection.
In that case, send a custom `BroadcastLock` range instead of the full-range helper script.

## Collection Withdrawal Commands

The collection owner can withdraw excess TON after deployment by sending `WithdrawTon`.
The contract always keeps a small storage reserve and rejects withdrawals that would exceed the currently available excess balance.

### Testnet

Using TON Connect:

```bash
npm run withdraw:testnet -- --tonconnect
```

Using mnemonic wallet:

```bash
npm run withdraw:testnet -- --mnemonic
```

### Mainnet

Using TON Connect:

```bash
npm run withdraw:mainnet -- --tonconnect
```

Using mnemonic wallet:

```bash
npm run withdraw:mainnet -- --mnemonic
```

## Wallet Options

The deployment command supports Blueprint's standard sender flags, for example:

- `--tonconnect`
- `--deeplink`
- `--tonhub`
- `--mnemonic`

If you use `--mnemonic`, set these env vars too:

- `WALLET_MNEMONIC`
- `WALLET_VERSION`

Example:

```bash
WALLET_VERSION=v4 npm run deploy:testnet -- --mnemonic
```

For Blueprint's mnemonic sender, Tonkeeper `v4R2` wallets should also be configured as `WALLET_VERSION=v4`.

## What The Script Does

The deploy script:

1. Detects the active network from Blueprint (`testnet` or `mainnet`)
2. Reads the matching deployment config from `.env`
3. Builds collection metadata cells
4. Computes the contract address from init data
5. Prints a deployment summary
6. Sends the deploy transaction
7. Waits until the contract is active

The royalty update script:

1. Detects the active network from Blueprint
2. Reads the collection address and new royalty config from `.env`
3. Reads the current royalty state on-chain
4. Prints the current and target royalty values
5. Sends the owner-only `UpdateRoyalty` message

The batch mint script:

1. Detects the active network from Blueprint
2. Reads the collection address and manifest path from `.env`
3. Loads the selected manifest rows
4. Converts each row's `fileName` into item `individual_content`
5. Sends one `Mint` message per row with the configured `ownerAddress`

The unlock trading script:

1. Opens the configured collection address
2. Reads `next_item_index`
3. Sends `SetMintLock { locked: false }`
4. Waits briefly
5. Sends a full-range `BroadcastLock { locked: false, from_index: 0, to_index: next_item_index }`

The withdraw script:

1. Detects the active network from Blueprint
2. Reads the collection address and withdrawal config from `.env`
3. Reads the current on-chain collection owner
4. Defaults the withdrawal destination to that owner when no destination is configured
5. Sends the owner-only `WithdrawTon` message

## Output

On success, Blueprint will print:

- the deployed contract address
- an explorer link for the selected network

The script also prints:

- selected network
- owner address
- collection metadata URL
- common item metadata prefix
- royalty configuration
- predicted collection address

The batch mint script also prints:

- collection address
- manifest path
- current `next_item_index`
- selected row range
- per-mint value

The royalty update script also prints:

- collection address
- current royalty configuration
- new royalty configuration

The withdraw script also prints:

- collection address
- on-chain collection owner
- withdrawal amount
- withdrawal destination

## Recommended Workflow

1. Fill in `TESTNET_*` variables first
2. Run `npm run build`
3. Deploy to testnet
4. Verify metadata and getters on-chain
5. Generate and upload item metadata, then run `npm run batch-mint:testnet -- --tonconnect`
6. If royalty changes later, fill in `TESTNET_COLLECTION_ADDRESS` plus `TESTNET_NEW_ROYALTY_*` and run `npm run update-royalty:testnet -- --tonconnect`
7. If excess TON accumulates later, fill in `TESTNET_COLLECTION_ADDRESS` plus `TESTNET_WITHDRAW_*` and run `npm run withdraw:testnet -- --tonconnect`
8. Fill in `MAINNET_*` variables
9. Deploy to mainnet
10. Upload mainnet metadata and run `npm run batch-mint:mainnet -- --tonconnect`
11. If needed later, update mainnet royalty with `npm run update-royalty:mainnet -- --tonconnect`
12. If needed later, withdraw mainnet excess TON with `npm run withdraw:mainnet -- --tonconnect`

## Related Docs

- [NFT_TRADING_LOCK_GUIDE.md](/Users/lake/work/tbook/ton-nft-getgems/NFT_TRADING_LOCK_GUIDE.md)
- [STANDARD_NFT_MILESTONE_LOCK_ARCHITECTURE.md](/Users/lake/work/tbook/ton-nft-getgems/STANDARD_NFT_MILESTONE_LOCK_ARCHITECTURE.md)
