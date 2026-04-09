import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { BatchStatusQueryDto } from './dto/batch-status-query.dto';
import { CreateBatchMintDto } from './dto/create-batch-mint.dto';
import { CreateBatchMintV2Dto } from './dto/create-batch-mint-v2.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateMintDto } from './dto/create-mint.dto';
import { CreateUploadCredentialsDto } from './dto/create-upload-credentials.dto';
import { MintingTaskQueryDto } from './dto/minting-task-query.dto';
import { NetworkQueryDto } from './dto/network-query.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { MintingService } from './minting.service';

@Controller('minting')
export class MintingController {
  constructor(private readonly mintingService: MintingService) {}

  // ── Collection creation ────────────────────────────────────────────

  @Post('templates/:collectionAddress/collections')
  createCollectionFromTemplate(
    @Param('collectionAddress') collectionAddress: string,
    @Body() dto: CreateCollectionDto,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.createCollectionFromTemplate(collectionAddress, dto, query.network);
  }

  @Get('templates/:collectionAddress/collections/:requestId')
  getCollectionCreationStatus(
    @Param('collectionAddress') collectionAddress: string,
    @Param('requestId') requestId: string,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.getCollectionCreationStatus(collectionAddress, requestId, query.network);
  }

  // ── Upload credentials ─────────────────────────────────────────────

  @Post('collections/:collectionAddress/upload-credentials')
  createUploadCredentials(
    @Param('collectionAddress') collectionAddress: string,
    @Body() dto: CreateUploadCredentialsDto,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.createUploadCredentials(collectionAddress, dto.fileName, query.network);
  }

  // ── Minting ────────────────────────────────────────────────────────

  @Post('collections/:collectionAddress/items')
  createMint(
    @Param('collectionAddress') collectionAddress: string,
    @Body() dto: CreateMintDto,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.createMint(collectionAddress, dto, query.network);
  }

  @Post('collections/:collectionAddress/items/batch')
  createBatchMint(
    @Param('collectionAddress') collectionAddress: string,
    @Body() dto: CreateBatchMintDto,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.createBatchMint(collectionAddress, dto, query.network);
  }

  @Post('collections/:collectionAddress/items/batch/v2')
  createBatchMintV2(
    @Param('collectionAddress') collectionAddress: string,
    @Body() dto: CreateBatchMintV2Dto,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.createBatchMintV2(collectionAddress, dto, query.network);
  }

  @Post('collections/:collectionAddress/items/batch/v2/status')
  getBatchMintStatusV2(
    @Param('collectionAddress') collectionAddress: string,
    @Body() dto: BatchStatusQueryDto,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.getBatchMintStatusV2(collectionAddress, dto.requestIds, query.network);
  }

  // ── Mint status & tasks ────────────────────────────────────────────

  @Get('collections/:collectionAddress/requests/:requestId')
  getMintStatus(
    @Param('collectionAddress') collectionAddress: string,
    @Param('requestId') requestId: string,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.getMintStatus(collectionAddress, requestId, query.network);
  }

  @Get('collections/:collectionAddress/tasks')
  getTaskList(
    @Param('collectionAddress') collectionAddress: string,
    @Query() query: MintingTaskQueryDto,
  ) {
    return this.mintingService.getTaskList(collectionAddress, query.after, query.limit, query.reverse, query.network);
  }

  // ── Wallet ─────────────────────────────────────────────────────────

  @Get('collections/:collectionAddress/wallet-balance')
  getWalletBalance(@Param('collectionAddress') collectionAddress: string, @Query() query: NetworkQueryDto) {
    return this.mintingService.getWalletBalance(collectionAddress, query.network);
  }

  @Post('collections/:collectionAddress/refund/:receiverAddress')
  refundWallet(
    @Param('collectionAddress') collectionAddress: string,
    @Param('receiverAddress') receiverAddress: string,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.refundWallet(collectionAddress, receiverAddress, query.network);
  }

  @Post('collections/:collectionAddress/deactivate')
  deactivateApi(
    @Param('collectionAddress') collectionAddress: string,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.deactivateApi(collectionAddress, query.network);
  }

  // ── Collection metadata ────────────────────────────────────────────

  @Post('collections/:collectionAddress/metadata')
  updateCollection(
    @Param('collectionAddress') collectionAddress: string,
    @Body() dto: UpdateCollectionDto,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.updateCollection(collectionAddress, dto, query.network);
  }

  @Get('collections/:collectionAddress/metadata/:requestId')
  getCollectionUpdateStatus(
    @Param('collectionAddress') collectionAddress: string,
    @Param('requestId') requestId: string,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.getCollectionUpdateStatus(collectionAddress, requestId, query.network);
  }

  // ── NFT metadata ──────────────────────────────────────────────────

  @Post('collections/:collectionAddress/items/:nftAddress/metadata')
  updateNft(
    @Param('collectionAddress') collectionAddress: string,
    @Param('nftAddress') nftAddress: string,
    @Body() dto: UpdateNftDto,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.updateNft(collectionAddress, nftAddress, dto, query.network);
  }

  @Get('collections/:collectionAddress/items/:nftAddress/update-status')
  getNftUpdateStatus(
    @Param('collectionAddress') collectionAddress: string,
    @Param('nftAddress') nftAddress: string,
    @Query() query: NetworkQueryDto,
  ) {
    return this.mintingService.getNftUpdateStatus(collectionAddress, nftAddress, query.network);
  }
}
