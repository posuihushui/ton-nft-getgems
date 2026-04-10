import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { AppEnvironment } from '../config/env.validation';
import { normalizeGetgemsNetwork, type GetgemsNetwork } from '../getgems/getgems.network';

export type NftItem = {
  address: string;
  collectionAddress: string;
  ownerAddress: string;
  actualOwnerAddress: string;
  image: string;
  name: string;
  description: string;
  attributes: Array<{ trait_type: string; value: string }>;
  sale: null | {
    type: string;
    currency: string;
    minBid?: string;
    maxBid?: string | null;
    price?: string;
  };
};

export type NftCollection = {
  address: string;
  name: string;
  description: string;
  image: string;
  coverImage: string | null;
  ownerAddress: string;
  externalLink: string | null;
};

@Injectable()
export class NftsService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService<AppEnvironment, true>,
  ) { }

  /** GET /nft/collection/items/:collectionAddress - list NFTs within a collection */
  async getCollectionNfts(
    collectionAddress: string,
    cursor?: string,
    limit = 20,
    network?: GetgemsNetwork,
  ) {
    const baseUrl = this.getBaseUrl(network);
    const params: Record<string, string | number> = { limit };
    if (cursor) params.cursor = cursor;

    return this.request<{
      success: boolean;
      response: { items: NftItem[]; cursor: string | null };
    }>(`${baseUrl}/nft/collection/items/${encodeURIComponent(collectionAddress)}`, params, 'minting', network);
  }

  /** GET /nft/collection/by-address/:collectionAddress/:nftAddress - get single NFT details */
  async getNftItem(collectionAddress: string, nftAddress: string, network?: GetgemsNetwork) {
    const baseUrl = this.getBaseUrl(network);
    return this.request<{
      success: boolean;
      response: NftItem;
    }>(
      `${baseUrl}/nft/collection/by-address/${encodeURIComponent(collectionAddress)}/${encodeURIComponent(nftAddress)}`,
      {},
      'minting',
      network,
    );
  }

  /** GET /v1/nft/search - search NFTs in collection */
  async searchCollectionNfts(
    collectionAddress: string,
    query?: string,
    cursor?: string,
    limit = 20,
    network?: GetgemsNetwork,
  ) {
    const baseUrl = this.getBaseUrl(network);
    const params: Record<string, string | number> = {
      collectionAddress,
      limit,
    };
    if (query) params.query = query;
    if (cursor) params.cursor = cursor;

    return this.request<{
      success: boolean;
      response: { items: NftItem[]; cursor: string | null };
    }>(`${baseUrl}/v1/nft/search`, params, 'minting', network);
  }

  /** GET /v1/nfts/on-sale/:collectionAddress - on-sale NFTs */
  async getOnSaleNfts(
    collectionAddress: string,
    cursor?: string,
    limit = 20,
    network?: GetgemsNetwork,
  ) {
    const baseUrl = this.getBaseUrl(network);
    const params: Record<string, string | number> = { limit };
    if (cursor) params.cursor = cursor;

    return this.request<{
      success: boolean;
      response: { items: NftItem[]; cursor: string | null };
    }>(`${baseUrl}/v1/nfts/on-sale/${encodeURIComponent(collectionAddress)}`, params, 'minting', network);
  }

  private async request<T>(
    url: string,
    params: Record<string, string | number>,
    scope: 'read' | 'minting' = 'read',
    network?: GetgemsNetwork,
  ): Promise<T> {
    const selectedNetwork = this.resolveNetwork(network);
    const apiKey = this.getApiKey(selectedNetwork, scope);

    if (!apiKey) {
      throw new ServiceUnavailableException(
        `Getgems ${scope} API key is missing for ${selectedNetwork}. Configure ${this.getApiKeyEnvVarName(selectedNetwork, scope)} in apps/api/.env before calling endpoints.`,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(url, {
          params,
          headers: {
            Accept: 'application/json',
            Authorization: apiKey,
          },
        }),
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new HttpException(
          error.response?.data ?? 'GetGems API request failed',
          error.response?.status ?? 502,
        );
      }
      throw new InternalServerErrorException('Unexpected GetGems integration error.');
    }
  }

  private getBaseUrl(network?: GetgemsNetwork): string {
    const resolved = this.resolveNetwork(network);
    if (resolved === 'testnet') {
      return this.configService.get('GETGEMS_TESTNET_API_BASE_URL', { infer: true });
    }
    return this.configService.get('GETGEMS_MAINNET_API_BASE_URL', { infer: true });
  }

  private getApiKey(network: GetgemsNetwork, scope: 'read' | 'minting'): string {
    const envVar = this.getApiKeyEnvVarName(network, scope);
    return this.configService.get(envVar, { infer: true });
  }

  private getApiKeyEnvVarName(network: GetgemsNetwork, scope: 'read' | 'minting'): keyof AppEnvironment {
    if (network === 'testnet') {
      return scope === 'read' ? 'GETGEMS_TESTNET_READ_API_KEY' : 'GETGEMS_TESTNET_API_KEY';
    }

    return scope === 'read' ? 'GETGEMS_MAINNET_READ_API_KEY' : 'GETGEMS_MAINNET_API_KEY';
  }

  private resolveNetwork(network?: GetgemsNetwork): GetgemsNetwork {
    return normalizeGetgemsNetwork(network, this.configService.get('NETWORK', { infer: true }));
  }
}
