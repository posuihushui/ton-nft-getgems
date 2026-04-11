# TON NFT Getgems Issuer Workspace

This workspace contains a production-oriented starter architecture for issuing TON NFTs through the Getgems Public API.

## Apps

- `apps/api`: NestJS backend that wraps the Getgems minting endpoints and keeps API keys server-side.
- `apps/web`: Vite + React operations dashboard for the minting flow, architecture overview, and API health checks.
- `apps/contracts`: TON Blueprint + Tact contracts for the custom NFT collection and item flow.

## Contract Notes

The custom milestone-lock NFT contracts intentionally expose only single-item `Mint`.

- `BatchMint` has been removed from the collection contract to keep minting semantics simple and auditable.
- Operationally this means `1 transaction = 1 NFT`.
- Lock/unlock still uses ranged `BroadcastLock`, because broadcast is a maintenance operation rather than a minting interface.

## Quick Start

```bash
npm install
copy apps\\api\\.env.example apps\\api\\.env
copy apps\\web\\.env.example apps\\web\\.env
npm run dev
```

The backend runs on `http://localhost:3000/api` and the frontend runs on `http://localhost:5173`.

## Network Configuration

Backend default network:

- `NETWORK=mainnet` or `NETWORK=testnet`
- `GETGEMS_MAINNET_READ_API_KEY`
- `GETGEMS_MAINNET_API_KEY`
- `GETGEMS_TESTNET_READ_API_KEY`
- `GETGEMS_TESTNET_API_KEY`
- `GETGEMS_MAINNET_API_BASE_URL`
- `GETGEMS_TESTNET_API_BASE_URL`

Frontend default network:

- `VITE_DEFAULT_NETWORK=mainnet`
- `VITE_ENABLED_NETWORKS=mainnet,testnet`

The UI can switch networks at runtime, and the backend can also accept `?network=mainnet` or `?network=testnet` on supported endpoints.

## Root Documentation

- `GETGEMS_MINTING_GUIDE.md`: implementation flow, architecture notes, API mapping, and official references.
- `NFT_TRADING_LOCK_GUIDE.md`: custom contract approach for milestone lock / unlock, including the single-mint policy.
