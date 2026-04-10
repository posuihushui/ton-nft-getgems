import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError, type Method } from 'axios';
import { firstValueFrom } from 'rxjs';

import { AppEnvironment } from '../config/env.validation';
import {
  normalizeGetgemsNetwork,
  type GetgemsNetwork,
} from './getgems.network';
import type {
  GetgemsApiResponse,
  GetgemsCollectionCreatingStatus,
  GetgemsMessageResponse,
  GetgemsMintingListItem,
  GetgemsMintingStatusObject,
  GetgemsUpdateResponse,
  GetgemsUploadCredentials,
  GetgemsWalletBalance,
} from './getgems.types';

type GetgemsApiScope = 'minting' | 'read';
type GetgemsApiKeyEnvVar =
  | 'GETGEMS_MAINNET_API_KEY'
  | 'GETGEMS_TESTNET_API_KEY'
  | 'GETGEMS_MAINNET_READ_API_KEY'
  | 'GETGEMS_TESTNET_READ_API_KEY';

@Injectable()
export class GetgemsService {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService<AppEnvironment, true>,
  ) {}

  async createCollectionFromTemplate(collectionAddress: string, payload: unknown, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsCollectionCreatingStatus>>(
      'POST',
      `/minting/${collectionAddress}/new-collection`,
      payload,
      undefined,
      network,
    );
  }

  async getCollectionCreationStatus(collectionAddress: string, requestId: string, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsCollectionCreatingStatus>>(
      'GET',
      `/minting/${collectionAddress}/new-collection/${requestId}`,
      undefined,
      undefined,
      network,
    );
  }

  async createUploadCredentials(collectionAddress: string, fileName: string, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsUploadCredentials>>(
      'POST',
      `/minting/create-upload/${collectionAddress}/${fileName}`,
      undefined,
      undefined,
      network,
    );
  }

  async createMint(collectionAddress: string, payload: unknown, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsMintingStatusObject>>(
      'POST',
      `/minting/${collectionAddress}`,
      payload,
      undefined,
      network,
    );
  }

  async createBatchMint(collectionAddress: string, payload: unknown, network?: GetgemsNetwork) {
    return this.request<{
      response: Array<{
        success: boolean;
        requestId?: string;
        errorMessage?: string | null;
        data?: GetgemsMintingStatusObject;
      }>;
    }>('POST', `/minting/${collectionAddress}/batch`, payload, undefined, network);
  }

  async getMintStatus(collectionAddress: string, requestId: string, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsMintingStatusObject>>(
      'GET',
      `/minting/${collectionAddress}/${requestId}`,
      undefined,
      undefined,
      network,
    );
  }

  async getMintingTaskList(
    collectionAddress: string,
    after?: string,
    limit?: number,
    reverse?: boolean,
    network?: GetgemsNetwork,
  ) {
    return this.request<
      GetgemsApiResponse<{
        cursor: string | null;
        items: GetgemsMintingListItem[];
      }>
    >('GET', `/minting/${collectionAddress}/list`, undefined, {
      after,
      limit,
      reverse,
    }, network);
  }

  async getWalletBalance(collectionAddress: string, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsWalletBalance>>(
      'GET',
      `/minting/${collectionAddress}/wallet-balance`,
      undefined,
      undefined,
      network,
    );
  }

  async updateCollection(collectionAddress: string, payload: unknown, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsUpdateResponse>>(
      'POST',
      `/minting/${collectionAddress}/update-collection`,
      payload,
      undefined,
      network,
    );
  }

  async updateNft(collectionAddress: string, nftAddress: string, payload: unknown, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsUpdateResponse>>(
      'POST',
      `/minting/${collectionAddress}/update/${nftAddress}`,
      payload,
      undefined,
      network,
    );
  }

  async refundWallet(collectionAddress: string, receiverAddress: string, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsMessageResponse>>(
      'POST',
      `/minting/${collectionAddress}/refund/${receiverAddress}`,
      undefined,
      undefined,
      network,
    );
  }

  async deactivateApi(collectionAddress: string, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsMessageResponse>>(
      'POST',
      `/minting/${collectionAddress}/deactivate-api`,
      undefined,
      undefined,
      network,
    );
  }

  async getCollectionUpdateStatus(collectionAddress: string, requestId: string, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsUpdateResponse>>(
      'GET',
      `/minting/${collectionAddress}/update-collection/${requestId}`,
      undefined,
      undefined,
      network,
    );
  }

  async getNftUpdateStatus(collectionAddress: string, nftAddress: string, network?: GetgemsNetwork) {
    return this.request<GetgemsApiResponse<GetgemsUpdateResponse>>(
      'GET',
      `/minting/${collectionAddress}/update/${nftAddress}`,
      undefined,
      undefined,
      network,
    );
  }

  async createBatchMintV2(collectionAddress: string, payload: unknown, network?: GetgemsNetwork) {
    return this.request<{
      response: Array<{
        success: boolean;
        requestId?: string;
        errorMessage?: string | null;
        data?: GetgemsMintingStatusObject;
      }>;
    }>('POST', `/v2/minting/${collectionAddress}/batch`, payload, undefined, network);
  }

  async getBatchMintStatusV2(collectionAddress: string, requestIds: string[], network?: GetgemsNetwork) {
    return this.request<{
      response: Array<{
        success: boolean;
        requestId?: string;
        errorMessage?: string | null;
        data?: GetgemsMintingStatusObject;
      }>;
    }>('POST', `/v2/minting/${collectionAddress}/batch-status`, { requestIds }, undefined, network);
  }

  getDefaultCollectionAddress(): string {
    return this.configService.get('GETGEMS_COLLECTION_ADDRESS', { infer: true });
  }

  getNetworkSummary(network?: GetgemsNetwork) {
    const selectedNetwork = this.resolveNetwork(network);
    const networkKeyConfig = {
      mainnet: this.getApiKeySummary('mainnet'),
      testnet: this.getApiKeySummary('testnet'),
    };

    return {
      defaultNetwork: this.configService.get('NETWORK', { infer: true }),
      selectedNetwork,
      collectionAddress: this.getDefaultCollectionAddress(),
      getgemsBaseUrl: this.getBaseUrl(selectedNetwork),
      networkConfig: {
        mainnet: this.hasRequiredApiKeys('mainnet'),
        testnet: this.hasRequiredApiKeys('testnet'),
      },
      networkKeyConfig,
      selectedNetworkKeyConfig: networkKeyConfig[selectedNetwork],
    };
  }

  private async request<T>(
    method: Method,
    path: string,
    data?: unknown,
    params?: Record<string, unknown>,
    network?: GetgemsNetwork,
  ): Promise<T> {
    const selectedNetwork = this.resolveNetwork(network);
    const baseUrl = this.getBaseUrl(selectedNetwork);
    const apiKey = this.getApiKey(selectedNetwork, 'minting');

    if (!apiKey) {
      throw new ServiceUnavailableException(
        `Getgems minting API key is missing for ${selectedNetwork}. Configure ${this.getEnvVarName(selectedNetwork, 'minting')} in apps/api/.env before calling minting endpoints.`,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.request<T>({
          method,
          url: `${baseUrl}${path}`,
          data,
          params,
          headers: {
            Accept: 'application/json',
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new HttpException(error.response?.data ?? 'Getgems request failed', error.response?.status ?? 502);
      }

      throw new InternalServerErrorException('Unexpected Getgems integration error.');
    }
  }

  private resolveNetwork(network?: GetgemsNetwork): GetgemsNetwork {
    return normalizeGetgemsNetwork(network, this.configService.get('NETWORK', { infer: true }));
  }

  private getBaseUrl(network: GetgemsNetwork): string {
    if (network === 'testnet') {
      return this.configService.get('GETGEMS_TESTNET_API_BASE_URL', { infer: true });
    }

    return this.configService.get('GETGEMS_MAINNET_API_BASE_URL', { infer: true });
  }

  private getApiKey(network: GetgemsNetwork, scope: GetgemsApiScope): string {
    const envVarName = this.getEnvVarName(network, scope);

    return this.configService.get(envVarName, { infer: true });
  }

  private getEnvVarName(network: GetgemsNetwork, scope: GetgemsApiScope): GetgemsApiKeyEnvVar {
    if (network === 'testnet') {
      return scope === 'read' ? 'GETGEMS_TESTNET_READ_API_KEY' : 'GETGEMS_TESTNET_API_KEY';
    }

    return scope === 'read' ? 'GETGEMS_MAINNET_READ_API_KEY' : 'GETGEMS_MAINNET_API_KEY';
  }

  private getApiKeySummary(network: GetgemsNetwork) {
    return {
      readApiKeyConfigured: this.getApiKey(network, 'read').length > 0,
      mintingApiKeyConfigured: this.getApiKey(network, 'minting').length > 0,
    };
  }

  private hasRequiredApiKeys(network: GetgemsNetwork): boolean {
    const summary = this.getApiKeySummary(network);

    return summary.readApiKeyConfigured && summary.mintingApiKeyConfigured;
  }
}
