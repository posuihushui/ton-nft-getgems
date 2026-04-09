export const NETWORKS = ['mainnet', 'testnet'] as const;

export type GetgemsNetwork = (typeof NETWORKS)[number];

export type HealthPayload = {
  service: string;
  status: string;
  now: string;
  environment: string;
  defaultNetwork: GetgemsNetwork;
  selectedNetwork: GetgemsNetwork;
  collectionAddress: string;
  getgemsBaseUrl: string;
  getgemsConfigured: boolean;
  networkConfig: Record<GetgemsNetwork, boolean>;
};

type RequestOptions = {
  method?: 'GET' | 'POST';
  network?: GetgemsNetwork;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export function getEnabledNetworks(): GetgemsNetwork[] {
  const raw = import.meta.env.VITE_ENABLED_NETWORKS ?? import.meta.env.VITE_DEFAULT_NETWORK ?? 'mainnet';
  const values = String(raw)
    .split(',')
    .map((value) => value.trim())
    .filter((value): value is GetgemsNetwork => NETWORKS.includes(value as GetgemsNetwork));

  return values.length > 0 ? values : ['mainnet'];
}

export function getDefaultNetwork(): GetgemsNetwork {
  const raw = String(import.meta.env.VITE_DEFAULT_NETWORK ?? 'mainnet');

  if (NETWORKS.includes(raw as GetgemsNetwork)) {
    return raw as GetgemsNetwork;
  }

  return getEnabledNetworks()[0];
}

export async function getHealth(network: GetgemsNetwork): Promise<HealthPayload> {
  return request<HealthPayload>('/health', {
    method: 'GET',
    network,
  });
}

export async function createCollectionFromTemplate(
  templateCollectionAddress: string,
  payload: {
    requestId: string;
    ownerAddress: string;
    royaltyPercent: number;
    royaltyAddress: string;
    metadata: {
      name: string;
      description: string;
      image?: string;
      external_link?: string;
      social_links?: string[];
      cover_image?: string;
    };
  },
  network: GetgemsNetwork,
) {
  return request(`/minting/templates/${encodeURIComponent(templateCollectionAddress)}/collections`, {
    method: 'POST',
    body: payload,
    network,
  });
}

export async function getCollectionCreationStatus(
  templateCollectionAddress: string,
  requestId: string,
  network: GetgemsNetwork,
) {
  return request(
    `/minting/templates/${encodeURIComponent(templateCollectionAddress)}/collections/${encodeURIComponent(requestId)}`,
    {
      method: 'GET',
      network,
    },
  );
}

export async function getCollectionUpdateStatus(
  collectionAddress: string,
  requestId: string,
  network: GetgemsNetwork,
) {
  return request(
    `/minting/collections/${encodeURIComponent(collectionAddress)}/metadata/${encodeURIComponent(requestId)}`,
    {
      method: 'GET',
      network,
    },
  );
}
export async function createUploadCredentials(
  collectionAddress: string,
  fileName: string,
  network: GetgemsNetwork,
) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/upload-credentials`, {
    method: 'POST',
    body: { fileName },
    network,
  });
}

export async function updateCollectionMetadata(
  collectionAddress: string,
  payload: {
    requestId?: string;
    metadata?: {
      name?: string;
      description?: string;
      image?: string;
      external_link?: string;
      social_links?: string[];
      cover_image?: string;
    };
    royaltyPercent?: number;
    royaltyAddress?: string;
  },
  network: GetgemsNetwork,
) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/metadata`, {
    method: 'POST',
    body: payload,
    network,
  });
}

export async function createSingleMint(
  collectionAddress: string,
  payload: {
    requestId: string;
    ownerAddress: string;
    name: string;
    description: string;
    image: string;
    lottie?: string;
    content_url?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
    buttons?: Array<{ label: string; uri: string }>;
    index?: number;
  },
  network: GetgemsNetwork,
) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/items`, {
    method: 'POST',
    body: payload,
    network,
  });
}

export async function createBatchMint(
  collectionAddress: string,
  payload: {
    requestId: string;
    items: Array<{
      ownerAddress: string;
      name: string;
      description: string;
      image: string;
      lottie?: string;
      content_url?: string;
      attributes?: Array<{ trait_type: string; value: string }>;
      buttons?: Array<{ label: string; uri: string }>;
      index?: number;
    }>;
  },
  network: GetgemsNetwork,
) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/items/batch`, {
    method: 'POST',
    body: payload,
    network,
  });
}

export async function createBatchMintV2(
  collectionAddress: string,
  payload: {
    items: Array<{
      requestId?: string;
      ownerAddress: string;
      name: string;
      description: string;
      image: string;
      lottie?: string;
      content_url?: string;
      attributes?: Array<{ trait_type: string; value: string }>;
      buttons?: Array<{ label: string; uri: string }>;
      index?: number;
    }>;
  },
  network: GetgemsNetwork,
) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/items/batch/v2`, {
    method: 'POST',
    body: payload,
    network,
  });
}

export async function getMintStatus(
  collectionAddress: string,
  requestId: string,
  network: GetgemsNetwork,
) {
  return request(
    `/minting/collections/${encodeURIComponent(collectionAddress)}/requests/${encodeURIComponent(requestId)}`,
    {
      method: 'GET',
      network,
    },
  );
}

export async function getMintTasks(
  collectionAddress: string,
  network: GetgemsNetwork,
  query?: {
    after?: string;
    limit?: number;
    reverse?: boolean;
  },
) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/tasks`, {
    method: 'GET',
    network,
    query: query as unknown as Record<string, string | number | undefined>,
  });
}

export async function getWalletBalance(collectionAddress: string, network: GetgemsNetwork) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/wallet-balance`, {
    method: 'GET',
    network,
  });
}

export async function refundWallet(collectionAddress: string, receiverAddress: string, network: GetgemsNetwork) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/refund/${encodeURIComponent(receiverAddress)}`, {
    method: 'POST',
    network,
  });
}

export async function deactivateApi(collectionAddress: string, network: GetgemsNetwork) {
  return request(`/minting/collections/${encodeURIComponent(collectionAddress)}/deactivate`, {
    method: 'POST',
    network,
  });
}

export async function updateNftMetadata(
  collectionAddress: string,
  nftAddress: string,
  payload: {
    update: {
      name?: string;
      description?: string;
      image?: string;
      attributes?: Array<{ trait_type: string; value: string }>;
      upsertAttributes?: Array<{ trait_type: string; value: string }>;
      buttons?: Array<{ label: string; uri: string }>;
    };
  },
  network: GetgemsNetwork,
) {
  return request(
    `/minting/collections/${encodeURIComponent(collectionAddress)}/items/${encodeURIComponent(nftAddress)}/metadata`,
    {
      method: 'POST',
      body: payload,
      network,
    },
  );
}

export async function getNftUpdateStatus(
  collectionAddress: string,
  nftAddress: string,
  network: GetgemsNetwork,
) {
  return request(
    `/minting/collections/${encodeURIComponent(collectionAddress)}/items/${encodeURIComponent(nftAddress)}/update-status`,
    {
      method: 'GET',
      network,
    },
  );
}

async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const query = new URLSearchParams();

  if (options.network) {
    query.set('network', options.network);
  }

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.set(key, String(value));
      }
    });
  }

  const queryString = query.toString();
  const response = await fetch(`${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const payload = tryParseJson(text);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, response.status));
  }

  return payload as T;
}

function tryParseJson(value: string): unknown {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function getErrorMessage(payload: unknown, status: number): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const errorRecord = payload as {
      message?: string;
      error?: string;
      errors?: Array<{ message?: string }>;
    };

    if (errorRecord.message) {
      return errorRecord.message;
    }

    if (errorRecord.error) {
      return errorRecord.error;
    }

    if (Array.isArray(errorRecord.errors) && errorRecord.errors[0]?.message) {
      return errorRecord.errors[0].message ?? `Request failed with status ${status}`;
    }
  }

  return `Request failed with status ${status}`;
}
