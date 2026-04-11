# Batch Metadata Output

This directory is used for metadata JSON files generated from [getgems_batch_mint_template.csv](/Users/lake/work/tbook/ton-nft-getgems/apps/contracts/getgems_batch_mint_template.csv).

Generate files with:

```bash
cd /Users/lake/work/tbook/ton-nft-getgems/apps/contracts
npm run generate-batch-metadata
```

Optional custom paths:

```bash
node scripts/generateBatchMintMetadata.js getgems_batch_mint_template.csv metadata/generated/custom-run
```

The generator creates:

- one JSON file per row, named by `id`
- `manifest.json` for owner/file mapping

AWS upload suggestion:

1. Upload the generated `*.json` files to your S3 prefix such as `nft/`
2. Keep `manifest.json` locally for mint operations and owner reconciliation
3. Set `COMMON_CONTENT_URL` to that uploaded prefix, for example `https://static.example.com/nft/`

Batch mint with the manifest:

```bash
cd /Users/lake/work/tbook/ton-nft-getgems/apps/contracts
npm run batch-mint:testnet -- --tonconnect
```

The mint script reads:

- `COLLECTION_ADDRESS`
- `BATCH_MINT_MANIFEST`
- `BATCH_MINT_VALUE`
- `BATCH_MINT_START_INDEX`
- `BATCH_MINT_LIMIT`
- `BATCH_MINT_DELAY_MS`
