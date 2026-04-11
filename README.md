# TON NFT Getgems Issuer Workspace

This workspace contains a production-oriented starter architecture for issuing TON NFTs through the Getgems Public API.

## Apps

- `apps/api`: NestJS backend that wraps the Getgems minting endpoints and keeps API keys server-side.
- `apps/web`: Vite + React operations dashboard for the minting flow, architecture overview, and API health checks.
- `apps/contracts`: TON Blueprint + Tact contracts for the custom NFT collection and item flow.

## Contract Notes

The custom milestone-lock NFT contracts are now structured as a standard-compatible TON NFT collection/item pair with a minimal lock extension.

- The collection keeps the standard NFT getters and royalty interface, then adds `SetMintLock` and `BroadcastLock` for milestone control.
- Royalty remains TEP-66-readable and can now be updated later by the collection owner through `UpdateRoyalty`.
- `BatchMint` has been removed to keep minting semantics simple and auditable.
- Operationally this means `1 transaction = 1 NFT`.
- Lock/unlock for already minted items still uses ranged `BroadcastLock`, because broadcast is a maintenance operation rather than a minting interface.

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

- `STANDARD_NFT_MILESTONE_LOCK_ARCHITECTURE.md`: root-level architecture overview for the standard-compatible NFT + milestone lock contract track.
- `GETGEMS_MINTING_GUIDE.md`: implementation flow, architecture notes, API mapping, and official references.
- `NFT_TRADING_LOCK_GUIDE.md`: custom contract approach for milestone lock / unlock, including the single-mint policy.
- `apps/contracts/DEPLOYMENT.md`: contract-project deployment guide for testnet and mainnet environments.
