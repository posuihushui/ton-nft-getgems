# Contract Deployment

This document covers how to deploy the custom NFT collection contract from `apps/contracts` to both `testnet` and `mainnet`.

## Files

- [scripts/deployNftCollection.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/deployNftCollection.ts): deployment entrypoint
- [scripts/updateRoyalty.ts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/scripts/updateRoyalty.ts): owner-only royalty update entrypoint
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

### Optional variables

- `TESTNET_ROYALTY_NUMERATOR` / `MAINNET_ROYALTY_NUMERATOR`
- `TESTNET_ROYALTY_DENOMINATOR` / `MAINNET_ROYALTY_DENOMINATOR`
- `TESTNET_ROYALTY_DESTINATION` / `MAINNET_ROYALTY_DESTINATION`
- `TESTNET_DEPLOY_VALUE` / `MAINNET_DEPLOY_VALUE`
- `TESTNET_NEW_ROYALTY_DESTINATION` / `MAINNET_NEW_ROYALTY_DESTINATION`
- `TESTNET_UPDATE_ROYALTY_VALUE` / `MAINNET_UPDATE_ROYALTY_VALUE`

If `ROYALTY_DESTINATION` is empty, the deploy script uses the deployer wallet address.
If `NEW_ROYALTY_DESTINATION` is empty, the update script keeps the current on-chain royalty destination.

If a network-specific variable is missing, the script falls back to the unprefixed generic key:

- `COLLECTION_CONTENT_URL`
- `COMMON_CONTENT_URL`
- `ROYALTY_NUMERATOR`
- `ROYALTY_DENOMINATOR`
- `ROYALTY_DESTINATION`
- `DEPLOY_VALUE`
- `COLLECTION_ADDRESS`
- `NEW_ROYALTY_NUMERATOR`
- `NEW_ROYALTY_DENOMINATOR`
- `NEW_ROYALTY_DESTINATION`
- `UPDATE_ROYALTY_VALUE`

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
WALLET_VERSION=v4R2 npm run deploy:testnet -- --mnemonic
```

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

The royalty update script also prints:

- collection address
- current royalty configuration
- new royalty configuration

## Recommended Workflow

1. Fill in `TESTNET_*` variables first
2. Run `npm run build`
3. Deploy to testnet
4. Verify metadata and getters on-chain
5. If royalty changes later, fill in `TESTNET_COLLECTION_ADDRESS` plus `TESTNET_NEW_ROYALTY_*` and run `npm run update-royalty:testnet -- --tonconnect`
6. Fill in `MAINNET_*` variables
7. Deploy to mainnet
8. If needed later, update mainnet royalty with `npm run update-royalty:mainnet -- --tonconnect`

## Related Docs

- [NFT_TRADING_LOCK_GUIDE.md](/Users/lake/work/tbook/ton-nft-getgems/NFT_TRADING_LOCK_GUIDE.md)
- [STANDARD_NFT_MILESTONE_LOCK_ARCHITECTURE.md](/Users/lake/work/tbook/ton-nft-getgems/STANDARD_NFT_MILESTONE_LOCK_ARCHITECTURE.md)
