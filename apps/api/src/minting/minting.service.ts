import { Injectable } from '@nestjs/common';

import { GetgemsService } from '../getgems/getgems.service';
import { type GetgemsNetwork } from '../getgems/getgems.network';
import { CreateBatchMintDto } from './dto/create-batch-mint.dto';
import { CreateBatchMintV2Dto } from './dto/create-batch-mint-v2.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateMintDto } from './dto/create-mint.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateNftDto } from './dto/update-nft.dto';

@Injectable()
export class MintingService {
  constructor(private readonly getgemsService: GetgemsService) {}

  createCollectionFromTemplate(collectionAddress: string, dto: CreateCollectionDto, network?: GetgemsNetwork) {
    return this.getgemsService.createCollectionFromTemplate(collectionAddress, dto, network);
  }

  getCollectionCreationStatus(collectionAddress: string, requestId: string, network?: GetgemsNetwork) {
    return this.getgemsService.getCollectionCreationStatus(collectionAddress, requestId, network);
  }

  createUploadCredentials(collectionAddress: string, fileName: string, network?: GetgemsNetwork) {
    return this.getgemsService.createUploadCredentials(collectionAddress, fileName, network);
  }

  createMint(collectionAddress: string, dto: CreateMintDto, network?: GetgemsNetwork) {
    return this.getgemsService.createMint(collectionAddress, dto, network);
  }

  createBatchMint(collectionAddress: string, dto: CreateBatchMintDto, network?: GetgemsNetwork) {
    return this.getgemsService.createBatchMint(collectionAddress, dto, network);
  }

  createBatchMintV2(collectionAddress: string, dto: CreateBatchMintV2Dto, network?: GetgemsNetwork) {
    return this.getgemsService.createBatchMintV2(collectionAddress, dto, network);
  }

  getBatchMintStatusV2(collectionAddress: string, requestIds: string[], network?: GetgemsNetwork) {
    return this.getgemsService.getBatchMintStatusV2(collectionAddress, requestIds, network);
  }

  getMintStatus(collectionAddress: string, requestId: string, network?: GetgemsNetwork) {
    return this.getgemsService.getMintStatus(collectionAddress, requestId, network);
  }

  getTaskList(collectionAddress: string, after?: string, limit?: number, reverse?: boolean, network?: GetgemsNetwork) {
    return this.getgemsService.getMintingTaskList(collectionAddress, after, limit, reverse, network);
  }

  getWalletBalance(collectionAddress: string, network?: GetgemsNetwork) {
    return this.getgemsService.getWalletBalance(collectionAddress, network);
  }

  updateCollection(collectionAddress: string, dto: UpdateCollectionDto, network?: GetgemsNetwork) {
    return this.getgemsService.updateCollection(collectionAddress, dto, network);
  }

  getCollectionUpdateStatus(collectionAddress: string, requestId: string, network?: GetgemsNetwork) {
    return this.getgemsService.getCollectionUpdateStatus(collectionAddress, requestId, network);
  }

  updateNft(collectionAddress: string, nftAddress: string, dto: UpdateNftDto, network?: GetgemsNetwork) {
    return this.getgemsService.updateNft(collectionAddress, nftAddress, dto, network);
  }

  getNftUpdateStatus(collectionAddress: string, nftAddress: string, network?: GetgemsNetwork) {
    return this.getgemsService.getNftUpdateStatus(collectionAddress, nftAddress, network);
  }

  refundWallet(collectionAddress: string, receiverAddress: string, network?: GetgemsNetwork) {
    return this.getgemsService.refundWallet(collectionAddress, receiverAddress, network);
  }

  deactivateApi(collectionAddress: string, network?: GetgemsNetwork) {
    return this.getgemsService.deactivateApi(collectionAddress, network);
  }
}
