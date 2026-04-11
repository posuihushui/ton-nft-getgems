# Testnet Metadata Template

This folder contains a minimal testnet metadata layout for the contracts in [apps/contracts](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts).

Suggested hosted layout:

- `collection.json`
- `nft/1.json`
- `assets/collection.png`
- `assets/collection-cover.png`
- `assets/1.png`

Example environment mapping:

```env
TESTNET_COLLECTION_CONTENT_URL=https://testnet.example.com/collection.json
TESTNET_COMMON_CONTENT_URL=https://testnet.example.com/nft/
```

Example mint payload:

```ts
content: beginCell().storeStringTail('1.json').endCell()
```

Resulting item metadata URL:

```text
https://testnet.example.com/nft/1.json
```

Before deployment, replace the placeholder URLs in the JSON files with your real hosted asset URLs.
