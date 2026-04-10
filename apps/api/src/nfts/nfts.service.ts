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
  ) {}

  /** GET /v1/collection/getCollectionItems - list NFTs within a collection */
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
    }>(`${baseUrl}/v1/collection/getCollectionItems/${encodeURIComponent(collectionAddress)}`, params, network);
  }

  /** GET /v1/nft/getItemByAddress - get single NFT details */
  async getNftItem(nftAddress: string, network?: GetgemsNetwork) {
    const baseUrl = this.getBaseUrl(network);
    return this.request<{
      success: boolean;
      response: NftItem;
    }>(`${baseUrl}/v1/nft/getItemByAddress/${encodeURIComponent(nftAddress)}`, {}, network);
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
    }>(`${baseUrl}/v1/nft/search`, params, network);
  }

  /** GET /v1/nfts/collection/:collectionAddress - on-sale NFTs */
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
    }>(`${baseUrl}/v1/nfts/on-sale/${encodeURIComponent(collectionAddress)}`, params, network);
  }

  private async request<T>(url: string, params: Record<string, string | number>, network?: GetgemsNetwork): Promise<T> {
    const selectedNetwork = this.resolveNetwork(network);
    const apiKey = this.getReadApiKey(selectedNetwork);

    if (!apiKey) {
      throw new ServiceUnavailableException(
        `Getgems Read API key is missing for ${selectedNetwork}. Configure ${this.getReadApiKeyEnvVarName(selectedNetwork)} in apps/api/.env before calling read endpoints.`,
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
          error.response?.data ?? 'GetGems Read API request failed',
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

  private getReadApiKey(network: GetgemsNetwork): string {
    if (network === 'testnet') {
      return this.configService.get('GETGEMS_TESTNET_READ_API_KEY', { infer: true });
    }

    return this.configService.get('GETGEMS_MAINNET_READ_API_KEY', { infer: true });
  }

  private getReadApiKeyEnvVarName(network: GetgemsNetwork): 'GETGEMS_TESTNET_READ_API_KEY' | 'GETGEMS_MAINNET_READ_API_KEY' {
    if (network === 'testnet') {
      return 'GETGEMS_TESTNET_READ_API_KEY';
    }

    return 'GETGEMS_MAINNET_READ_API_KEY';
  }

  private resolveNetwork(network?: GetgemsNetwork): GetgemsNetwork {
    return normalizeGetgemsNetwork(network, this.configService.get('NETWORK', { infer: true }));
  }
}
