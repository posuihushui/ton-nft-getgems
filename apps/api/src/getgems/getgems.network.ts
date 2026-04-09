export const GETGEMS_NETWORKS = ['mainnet', 'testnet'] as const;

export type GetgemsNetwork = (typeof GETGEMS_NETWORKS)[number];

export function isGetgemsNetwork(value: string): value is GetgemsNetwork {
  return GETGEMS_NETWORKS.includes(value as GetgemsNetwork);
}

export function normalizeGetgemsNetwork(value: unknown, fallback: GetgemsNetwork): GetgemsNetwork {
  if (typeof value === 'string' && isGetgemsNetwork(value)) {
    return value;
  }

  return fallback;
}

