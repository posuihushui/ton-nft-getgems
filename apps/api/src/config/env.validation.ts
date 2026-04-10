import {
  GETGEMS_NETWORKS,
  isGetgemsNetwork,
  type GetgemsNetwork,
} from '../getgems/getgems.network';

export type AppEnvironment = {
  NODE_ENV: string;
  PORT: number;
  WEB_ORIGIN: string;
  NETWORK: GetgemsNetwork;
  GETGEMS_MAINNET_API_BASE_URL: string;
  GETGEMS_TESTNET_API_BASE_URL: string;
  GETGEMS_MAINNET_READ_API_KEY: string;
  GETGEMS_TESTNET_READ_API_KEY: string;
  GETGEMS_MAINNET_API_KEY: string;
  GETGEMS_TESTNET_API_KEY: string;
  GETGEMS_COLLECTION_ADDRESS: string;
};

export function validateEnvironment(raw: Record<string, unknown>): AppEnvironment {
  const port = Number(raw.PORT ?? 3000);
  const network = String(raw.NETWORK ?? 'mainnet');

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer.');
  }

  if (!isGetgemsNetwork(network)) {
    throw new Error(`NETWORK must be one of: ${GETGEMS_NETWORKS.join(', ')}.`);
  }

  return {
    NODE_ENV: String(raw.NODE_ENV ?? 'development'),
    PORT: port,
    WEB_ORIGIN: String(raw.WEB_ORIGIN ?? 'http://localhost:5173'),
    NETWORK: network,
    GETGEMS_MAINNET_API_BASE_URL: String(raw.GETGEMS_MAINNET_API_BASE_URL ?? 'https://api.getgems.io/public-api').replace(
      /\/$/,
      '',
    ),
    GETGEMS_TESTNET_API_BASE_URL: String(
      raw.GETGEMS_TESTNET_API_BASE_URL ?? 'https://api.testnet.getgems.io/public-api',
    ).replace(/\/$/, ''),
    GETGEMS_MAINNET_READ_API_KEY: String(raw.GETGEMS_MAINNET_READ_API_KEY ?? ''),
    GETGEMS_TESTNET_READ_API_KEY: String(raw.GETGEMS_TESTNET_READ_API_KEY ?? ''),
    GETGEMS_MAINNET_API_KEY: String(raw.GETGEMS_MAINNET_API_KEY ?? ''),
    GETGEMS_TESTNET_API_KEY: String(raw.GETGEMS_TESTNET_API_KEY ?? ''),
    GETGEMS_COLLECTION_ADDRESS: String(raw.GETGEMS_COLLECTION_ADDRESS ?? ''),
  };
}
